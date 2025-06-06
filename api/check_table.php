<?php
require_once 'config.php';

try {
    // Проверяем существование таблицы
    $stmt = $pdo->query("SHOW TABLES LIKE 'couriers'");
    $tableExists = $stmt->rowCount() > 0;
    
    echo "Table exists: " . ($tableExists ? "Yes" : "No") . "\n\n";
    
    if ($tableExists) {
        // Показываем структуру таблицы
        $stmt = $pdo->query("DESCRIBE couriers");
        echo "Table structure:\n";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Field: " . $row['Field'] . 
                 "\nType: " . $row['Type'] . 
                 "\nNull: " . $row['Null'] . 
                 "\nKey: " . $row['Key'] . 
                 "\nDefault: " . $row['Default'] . 
                 "\nExtra: " . $row['Extra'] . "\n\n";
        }
    }
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
?> 