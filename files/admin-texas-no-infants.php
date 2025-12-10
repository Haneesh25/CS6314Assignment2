<?php
session_start();
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel_deals";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error || !isset($_SESSION['currentUser']) || $_SESSION['currentUser']['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Error']);
    exit;
}

$texasCities = ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'];
$placeholders = implode(',', array_fill(0, count($texasCities), '?'));

$sql = "SELECT fb.*, f.origin, f.destination, f.departureDate, f.departureTime 
        FROM flight_booking fb 
        JOIN flights f ON fb.flightId = f.flightId 
        WHERE f.origin IN ($placeholders) 
        AND fb.flightBookingId NOT IN (
            SELECT DISTINCT t.flightBookingId 
            FROM tickets t 
            JOIN passengers p ON t.ssn = p.ssn 
            WHERE p.category = 'infant'
        )";

$stmt = $conn->prepare($sql);
$stmt->bind_param(str_repeat('s', count($texasCities)), ...$texasCities);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode(['success' => true, 'bookings' => $bookings]);
$conn->close();
?>
