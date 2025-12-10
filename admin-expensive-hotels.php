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

$sql = "SELECT hb.*, h.hotelName, h.city 
        FROM hotel_booking hb 
        JOIN hotels h ON hb.hotelId = h.hotelId 
        ORDER BY hb.totalPrice DESC 
        LIMIT 10";

$result = $conn->query($sql);
$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode(['success' => true, 'bookings' => $bookings]);
$conn->close();
?>
