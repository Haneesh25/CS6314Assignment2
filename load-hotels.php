<?php
session_start();
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel_deals";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if admin
if (!isset($_SESSION['currentUser']) || $_SESSION['currentUser']['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

// Check if hotels already exist
$check = $conn->query("SELECT COUNT(*) as count FROM hotels");
$row = $check->fetch_assoc();

if ($row['count'] >= 20) {
    echo json_encode(['success' => true, 'message' => 'Hotels already loaded (' . $row['count'] . ' hotels in database)']);
    exit;
}

// Sample hotels data (simulating XML parse)
$hotels = [
    ['H001', 'Grand Plaza Hotel', 'Houston', 120.00],
    ['H002', 'Comfort Inn Dallas', 'Dallas', 95.00],
    ['H003', 'Austin Suites', 'Austin', 110.00],
    ['H004', 'Riverwalk Resort', 'San Antonio', 130.00],
    ['H005', 'Fort Worth Inn', 'Fort Worth', 85.00],
    ['H006', 'El Paso Lodge', 'El Paso', 75.00],
    ['H007', 'Hollywood Hotel', 'Los Angeles', 180.00],
    ['H008', 'Golden Gate Inn', 'San Francisco', 200.00],
    ['H009', 'Beach Resort SD', 'San Diego', 165.00],
    ['H010', 'Capitol Suites', 'Sacramento', 105.00],
    ['H011', 'Tech Hotel SJ', 'San Jose', 155.00],
    ['H012', 'Valley Inn Fresno', 'Fresno', 80.00],
    ['H013', 'Luxury Towers Houston', 'Houston', 250.00],
    ['H014', 'Downtown Dallas Hotel', 'Dallas', 140.00],
    ['H015', 'Music City Hotel', 'Austin', 125.00],
    ['H016', 'LA Beach Hotel', 'Los Angeles', 195.00],
    ['H017', 'Bay Area Lodge', 'San Francisco', 185.00],
    ['H018', 'Harbor View SD', 'San Diego', 175.00],
    ['H019', 'Budget Inn Houston', 'Houston', 65.00],
    ['H020', 'Executive Suites Dallas', 'Dallas', 160.00]
];

$inserted = 0;

foreach ($hotels as $hotel) {
    $sql = "INSERT INTO hotels (hotelId, hotelName, city, pricePerNight) VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE hotelId=hotelId";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssd", $hotel[0], $hotel[1], $hotel[2], $hotel[3]);
    
    if ($stmt->execute()) {
        $inserted++;
    }
}

echo json_encode(['success' => true, 'message' => 'Loaded ' . $inserted . ' hotels into database']);
$conn->close();
?>
