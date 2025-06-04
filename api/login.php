<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $phone = $data['phone'] ?? '';
    $email = $data['email'] ?? '';
    
    if (empty($phone) && empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Phone or email is required']);
        exit;
    }

    // Проверяем клиента
    $query = "SELECT client_id, full_name, phone, email, address_id FROM clients WHERE ";
    $params = [];
    
    if (!empty($phone)) {
        $query .= "phone = ?";
        $params[] = $phone;
    } else {
        $query .= "email = ?";
        $params[] = $email;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $client = $stmt->fetch();

    if ($client) {
        // Если у клиента есть сохраненный адрес, получаем его
        if ($client['address_id']) {
            $stmt = $pdo->prepare("SELECT * FROM addresses WHERE address_id = ?");
            $stmt->execute([$client['address_id']]);
            $address = $stmt->fetch();
            $client['address'] = $address;
        }
        unset($client['address_id']); // Удаляем ID адреса из ответа

        echo json_encode([
            'success' => true,
            'client' => $client
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid phone or email']);
    }
}
?> 