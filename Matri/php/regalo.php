<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validar datos
if (empty($data['name']) || empty($data['email']) || empty($data['amount']) || $data['amount'] < 100) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos o inválidos']);
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
    
    $stmt = $conn->prepare("INSERT INTO honeymoon_contributions 
                          (name, email, amount, message, created_at) 
                          VALUES (:name, :email, :amount, :message, NOW())");
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':amount', $data['amount']);
    $stmt->bindParam(':message', $data['message']);
    $stmt->execute();
    
    // Enviar email de confirmación
    sendContributionConfirmation($data);
    
    echo json_encode(['success' => true, 'message' => 'Contribución registrada exitosamente']);

} catch(PDOException $e) {
    error_log("Error en la base de datos: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al procesar la contribución']);
}

function sendContributionConfirmation($data) {
    $to = $data['email'];
    $subject = "Confirmación de contribución - Luna de Miel de Ana y Carlos";
    
    $message = "Hola {$data['name']},\n\n";
    $message .= "Gracias por tu generosa contribución de {$data['amount']} MXN para nuestra luna de miel.\n\n";
    $message .= "Detalles de tu contribución:\n";
    $message .= "Monto: {$data['amount']} MXN\n";
    $message .= "Fecha: " . date('d/m/Y') . "\n\n";
    
    if (!empty($data['message'])) {
        $message .= "Tu mensaje: {$data['message']}\n\n";
    }
    
    $message .= "Con cariño,\nAna y Carlos";
    
    $headers = "From: no-reply@anaycarlos.com\r\n";
    $headers .= "Reply-To: ana@anaycarlos.com\r\n";
    
    @mail($to, $subject, $message, $headers);
}
?>