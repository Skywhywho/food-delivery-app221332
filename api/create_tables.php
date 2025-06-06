<?php
require_once 'config.php';

try {
    // Удаляем существующую таблицу couriers
    $pdo->exec("DROP TABLE IF EXISTS couriers");
    
    // Создаем таблицу couriers заново
    $sql = "CREATE TABLE couriers (
        courier_id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255) NOT NULL,
        status ENUM('свободен', 'занят', 'не работает') DEFAULT 'свободен',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($sql);
    echo "Table 'couriers' created successfully!";
    
} catch (PDOException $e) {
    die("Error creating table: " . $e->getMessage());
}
?> 