<?php
header('Content-Type: application/json');

// Validar método de petición
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Recibir datos JSON
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
if (empty($data['guest_id']) || empty($data['table_id']) || empty($data['category'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

// Conexión a la base de datos (ejemplo)
$dbHost = 'localhost';
$dbUser = 'usuario';
$dbPass = 'contraseña';
$dbName = 'matrimonio_db';

try {
    $conn = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 1. Verificar disponibilidad de la mesa
    $stmt = $conn->prepare("SELECT capacity, reserved FROM tables WHERE id = :table_id FOR UPDATE");
    $stmt->bindParam(':table_id', $data['table_id']);
    $stmt->execute();
    $table = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$table) {
        echo json_encode(['success' => false, 'message' => 'Mesa no encontrada']);
        exit;
    }
    
    $available = $table['capacity'] - $table['reserved'];
    $guestCount = count($data['guest_ids']);
    
    if ($available < $guestCount) {
        echo json_encode(['success' => false, 'message' => 'No hay suficiente espacio en esta mesa']);
        exit;
    }
    
    // 2. Verificar que todos los invitados existen y han confirmado asistencia
    $placeholders = implode(',', array_fill(0, count($data['guest_ids']), '?'));
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM guests WHERE id IN ($placeholders) AND rsvp = 1");
    $stmt->execute($data['guest_ids']);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['count'] != $guestCount) {
        echo json_encode(['success' => false, 'message' => 'Algunos invitados no han confirmado asistencia']);
        exit;
    }
    
    // 3. Crear reserva principal
    $stmt = $conn->prepare("INSERT INTO reservations 
                          (guest_id, table_id, category, table_name, special_requests, created_at) 
                          VALUES (:guest_id, :table_id, :category, :table_name, :special_requests, NOW())");
    $stmt->bindParam(':guest_id', $data['guest_id']);
    $stmt->bindParam(':table_id', $data['table_id']);
    $stmt->bindParam(':category', $data['category']);
    $stmt->bindParam(':table_name', $data['table_name']);
    $stmt->bindParam(':special_requests', $data['special_requests']);
    $stmt->execute();
    $reservationId = $conn->lastInsertId();
    
    // 4. Agregar compañeros de mesa
    foreach ($data['guest_ids'] as $guestId) {
        if ($guestId != $data['guest_id']) { // No duplicar al reservante principal
            $stmt = $conn->prepare("INSERT INTO reservation_guests 
                                  (reservation_id, guest_id) 
                                  VALUES (:reservation_id, :guest_id)");
            $stmt->bindParam(':reservation_id', $reservationId);
            $stmt->bindParam(':guest_id', $guestId);
            $stmt->execute();
        }
    }
    
    // 5. Actualizar disponibilidad de la mesa
    $newReserved = $table['reserved'] + $guestCount;
    $stmt = $conn->prepare("UPDATE tables SET reserved = :reserved WHERE id = :table_id");
    $stmt->bindParam(':reserved', $newReserved);
    $stmt->bindParam(':table_id', $data['table_id']);
    $stmt->execute();
    
    // 6. Enviar confirmación por email
    sendReservationConfirmation($data);
    
    echo json_encode([
        'success' => true,
        'message' => 'Reserva confirmada exitosamente',
        'reservation_id' => $reservationId
    ]);
    
} catch(PDOException $e) {
    error_log("Error en la base de datos: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al procesar la reserva']);
}

function sendReservationConfirmation($data) {
    // Obtener detalles para el email (simplificado)
    $to = $data['guest_email'];
    $subject = "Confirmación de reserva - Boda de Ana y Carlos";
    
    $message = "Hola {$data['guest_name']},\n\n";
    $message .= "Gracias por reservar tu lugar en nuestra boda.\n\n";
    $message .= "Detalles de tu reserva:\n";
    $message .= "Mesa: {$data['table_id']}\n";
    $message .= "Categoría: " . ucfirst($data['category']) . "\n";
    
    if (!empty($data['table_name'])) {
        $message .= "Nombre de mesa: {$data['table_name']}\n";
    }
    
    $message .= "Número de invitados: " . count($data['guest_ids']) . "\n\n";
    $message .= "Si necesitas hacer algún cambio, por favor contáctanos.\n\n";
    $message .= "Con cariño,\nAna y Carlos";
    
    $headers = "From: no-reply@anaycarlos.com\r\n";
    $headers .= "Reply-To: ana@anaycarlos.com\r\n";
    
    @mail($to, $subject, $message, $headers);
}
?>