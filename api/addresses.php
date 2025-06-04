<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $street = $_GET['street'] ?? '';
    
    try {
        if (!empty($street)) {
            // Поиск адресов по улице
            $stmt = $pdo->prepare("SELECT * FROM addresses WHERE street LIKE ? ORDER BY house_number");
            $stmt->execute([$street . '%']);
        } else {
            // Получение всех уникальных улиц
            $stmt = $pdo->query("SELECT DISTINCT street FROM addresses ORDER BY street");
        }
        
        $addresses = $stmt->fetchAll();
        echo json_encode([
            'success' => true,
            'addresses' => $addresses
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch addresses']);
    }
}

// Обновление адреса клиента
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $client_id = $data['client_id'] ?? null;
    $address_id = $data['address_id'] ?? null;
    
    if (!$client_id || !$address_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Client ID and Address ID are required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE clients SET address_id = ? WHERE client_id = ?");
        $stmt->execute([$address_id, $client_id]);
        
        if ($stmt->rowCount() > 0) {
            // Получаем обновленный адрес
            $stmt = $pdo->prepare("SELECT * FROM addresses WHERE address_id = ?");
            $stmt->execute([$address_id]);
            $address = $stmt->fetch();
            
            echo json_encode([
                'success' => true,
                'message' => 'Address updated successfully',
                'address' => $address
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Client not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update address']);
    }
}
?> 