<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $full_name = $data['full_name'] ?? '';
    $phone = $data['phone'] ?? '';
    $email = $data['email'] ?? '';
    
    if (empty($full_name) || empty($phone)) {
        http_response_code(400);
        echo json_encode(['error' => 'Full name and phone are required']);
        exit;
    }

    // Проверяем, не существует ли уже такой телефон или email
    $stmt = $pdo->prepare("SELECT client_id FROM clients WHERE phone = ? OR (email = ? AND email IS NOT NULL)");
    $stmt->execute([$phone, $email]);
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Phone or email already exists']);
        exit;
    }

    // Добавляем клиента
    $stmt = $pdo->prepare("INSERT INTO clients (full_name, phone, email) VALUES (?, ?, ?)");
    try {
        $stmt->execute([$full_name, $phone, $email]);
        $clientId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'client' => [
                'client_id' => $clientId,
                'full_name' => $full_name,
                'phone' => $phone,
                'email' => $email
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed']);
    }
}
?> 