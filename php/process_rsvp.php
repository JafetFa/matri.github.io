<?php
header('Content-Type: application/json');

// Configuración básica de seguridad
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Validar y sanitizar los datos de entrada
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
$guests = filter_input(INPUT_POST, 'guests', FILTER_SANITIZE_NUMBER_INT);
$attending = filter_input(INPUT_POST, 'attending', FILTER_SANITIZE_STRING);
$dietary = filter_input(INPUT_POST, 'dietary', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

// Validaciones básicas
if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Por favor ingresa tu nombre completo']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Por favor ingresa un email válido']);
    exit;
}

if (empty($attending)) {
    echo json_encode(['success' => false, 'message' => 'Por favor selecciona si asistirás o no']);
    exit;
}

// Configuración para la base de datos (ejemplo con MySQLi)
$dbHost = 'localhost';
$dbUser = 'usuario';
$dbPass = 'contraseña';
$dbName = 'matrimonio_db';

// Conexión a la base de datos
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    error_log("Error de conexión: " . $conn->connect_error);
    echo json_encode(['success' => false, 'message' => 'Error de conexión con la base de datos']);
    exit;
}

// Preparar la consulta SQL
$stmt = $conn->prepare("INSERT INTO rsvp_responses 
    (name, email, phone, guests, attending, dietary, message, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");

if (!$stmt) {
    error_log("Error al preparar la consulta: " . $conn->error);
    echo json_encode(['success' => false, 'message' => 'Error al procesar tu respuesta']);
    exit;
}

$stmt->bind_param("sssisss", $name, $email, $phone, $guests, $attending, $dietary, $message);

if ($stmt->execute()) {
    // Enviar email de confirmación (opcional)
    sendConfirmationEmail($name, $email, $attending);
    
    echo json_encode(['success' => true, 'message' => '¡Gracias por confirmar tu asistencia!']);
} else {
    error_log("Error al ejecutar la consulta: " . $stmt->error);
    echo json_encode(['success' => false, 'message' => 'Error al guardar tu respuesta']);
}

$stmt->close();
$conn->close();

// Función para enviar email de confirmación
function sendConfirmationEmail($name, $email, $attending) {
    $to = $email;
    $subject = "Confirmación de asistencia - Boda de Ana y Carlos";
    
    $message = "Hola $name,\n\n";
    $message .= "Gracias por confirmar tu asistencia a nuestra boda.\n\n";
    $message .= "Has indicado que " . ($attending === 'yes' ? "SÍ asistirás" : "NO asistirás") . " a nuestra celebración.\n\n";
    $message .= "Si necesitas hacer algún cambio o tienes alguna pregunta, no dudes en contactarnos.\n\n";
    $message .= "Con cariño,\nAna y Carlos";
    
    $headers = "From: no-reply@anaycarlos.com\r\n";
    $headers .= "Reply-To: ana@anaycarlos.com\r\n";
    
    @mail($to, $subject, $message, $headers);
}
?>