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

$californiaCities = ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno'];
$placeholders = implode(',', array_fill(0, count($californiaCities), '?'));

$sql = "SELECT COUNT(DISTINCT fb.flightBookingId) as count 
        FROM flight_booking fb 
        JOIN flights f ON fb.flightId = f.flightId 
        WHERE f.destination IN ($placeholders) 
        AND f.arrivalDate >= '2024-09-01' 
        AND f.arrivalDate <= '2024-10-31'";

$stmt = $conn->prepare($sql);
$stmt->bind_param(str_repeat('s', count($californiaCities)), ...$californiaCities);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode(['success' => true, 'count' => $row['count']]);
$conn->close();
?>
