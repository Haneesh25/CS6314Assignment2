<?php
// admin-texas-departures.php
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

$texasCities = ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'];
$placeholders = implode(',', array_fill(0, count($texasCities), '?'));

$sql = "SELECT fb.*, f.origin, f.destination, f.departureDate, f.departureTime 
        FROM flight_booking fb 
        JOIN flights f ON fb.flightId = f.flightId 
        WHERE f.origin IN ($placeholders) 
        AND f.departureDate >= '2024-09-01' 
        AND f.departureDate <= '2024-10-31'";

$stmt = $conn->prepare($sql);
$stmt->bind_param(str_repeat('s', count($texasCities)), ...$texasCities);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode([
    'success' => true,
    'bookings' => $bookings
]);

$conn->close();
?>
