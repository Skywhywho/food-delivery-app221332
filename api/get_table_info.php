<?php
require_once 'config.php';

try {
    // Проверяем существование таблицы
    $stmt = $pdo->prepare("SHOW TABLES LIKE 'couriers'");
    $stmt->execute();
    $tableExists = $stmt->rowCount() > 0;

    if (!$tableExists) {
        // Создаем таблицу, если она не существует
        $sql = "CREATE TABLE couriers (
            courier_id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL UNIQUE,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255) NOT NULL,
            status ENUM('свободен', 'занят', 'не работает') DEFAULT 'свободен'
        )";
        $pdo->exec($sql);
        echo json_encode(['message' => 'Table created successfully']);
    } else {
        // Получаем информацию о структуре таблицы
        $stmt = $pdo->prepare("DESCRIBE couriers");
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['columns' => $columns]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?> 