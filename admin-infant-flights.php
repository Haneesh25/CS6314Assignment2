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

$sql = "SELECT DISTINCT fb.*, f.origin, f.destination, f.departureDate, f.departureTime 
        FROM flight_booking fb 
        JOIN flights f ON fb.flightId = f.flightId 
        JOIN tickets t ON fb.flightBookingId = t.flightBookingId 
        JOIN passengers p ON t.ssn = p.ssn 
        WHERE p.category = 'infant'";

$result = $conn->query($sql);
$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode(['success' => true, 'bookings' => $bookings]);
$conn->close();
?>
