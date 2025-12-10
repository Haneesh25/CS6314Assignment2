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

if (!isset($_SESSION['currentUser'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$bookingId = $_POST['bookingId'] ?? '';

if (empty($bookingId)) {
    echo json_encode(['success' => false, 'message' => 'Booking ID is required']);
    exit;
}

$sql = "SELECT p.*, t.ticketId, t.price 
        FROM passengers p 
        JOIN tickets t ON p.ssn = t.ssn 
        WHERE t.flightBookingId = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $bookingId);
$stmt->execute();
$result = $stmt->get_result();

$passengers = [];
while ($row = $result->fetch_assoc()) {
    $passengers[] = $row;
}

echo json_encode([
    'success' => true,
    'passengers' => $passengers
]);

$conn->close();
?>
