<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$city = $_POST['city'] ?? '';

// Validate city
$texasCities = ['Houston','Dallas','Austin','San Antonio','Fort Worth','El Paso'];
$californiaCities = ['Los Angeles','San Francisco','San Diego','Sacramento','San Jose','Fresno'];
$allCities = array_merge($texasCities, $californiaCities);

if (!in_array($city, $allCities)) {
    echo json_encode(['success' => false, 'message' => 'Invalid city']);
    exit;
}

// Get hotels from database
$stmt = $pdo->prepare("SELECT * FROM hotels WHERE city = :city ORDER BY price_per_night ASC");
$stmt->execute([':city' => $city]);
$hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'hotels' => $hotels
]);
?>