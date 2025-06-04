<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, name, phone, status FROM couriers");
        $couriers = $stmt->fetchAll();
        echo json_encode([
            'success' => true,
            'couriers' => $couriers
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch couriers']);
    }
}
?> 