<?php
// Отключаем вывод ошибок в ответ
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Устанавливаем заголовок JSON для всех ответов
header('Content-Type: application/json');

// Функция для отправки JSON-ответа
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require_once 'config.php';

    // Проверяем метод запроса
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendJsonResponse([
            'success' => false,
            'error' => 'Method not allowed'
        ], 405);
    }

    // Получаем и проверяем входные данные
    $raw_data = file_get_contents('php://input');
    if (!$raw_data) {
        sendJsonResponse([
            'success' => false,
            'error' => 'No input data provided'
        ], 400);
    }

    $data = json_decode($raw_data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendJsonResponse([
            'success' => false,
            'error' => 'Invalid JSON: ' . json_last_error_msg()
        ], 400);
    }

    // Извлекаем и валидируем данные
    $full_name = trim($data['full_name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    // Проверяем обязательные поля
    if (empty($full_name) || empty($phone) || empty($password)) {
        sendJsonResponse([
            'success' => false,
            'error' => 'Full name, phone and password are required'
        ], 400);
    }

    // Проверяем уникальность телефона и email
    $stmt = $pdo->prepare("SELECT courier_id FROM couriers WHERE phone = ? OR (email = ? AND email IS NOT NULL AND email != '')");
    $stmt->execute([$phone, $email]);
    if ($stmt->rowCount() > 0) {
        sendJsonResponse([
            'success' => false,
            'error' => 'Phone or email already exists'
        ], 400);
    }

    // Хэшируем пароль
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Добавляем курьера
    $stmt = $pdo->prepare("INSERT INTO couriers (full_name, phone, email, password, status) VALUES (?, ?, ?, ?, 'свободен')");
    $stmt->execute([$full_name, $phone, $email ?: null, $hashed_password]);
    $courierId = $pdo->lastInsertId();

    // Отправляем успешный ответ
    sendJsonResponse([
        'success' => true,
        'message' => 'Registration successful',
        'courier' => [
            'courier_id' => $courierId,
            'full_name' => $full_name,
            'phone' => $phone,
            'email' => $email,
            'status' => 'свободен'
        ]
    ]);

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    sendJsonResponse([
        'success' => false,
        'error' => 'Database error occurred: ' . $e->getMessage()
    ], 500);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    sendJsonResponse([
        'success' => false,
        'error' => 'An error occurred: ' . $e->getMessage()
    ], 500);
}
?> 