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

$ssn = $_POST['ssn'] ?? '';

if (empty($ssn)) {
    echo json_encode(['success' => false, 'message' => 'SSN is required']);
    exit;
}

$bookings = [];

// Get flight bookings for this SSN
$sql = "SELECT DISTINCT fb.*, f.origin, f.destination, f.departureDate, 'flight' as type 
        FROM flight_booking fb 
        JOIN flights f ON fb.flightId = f.flightId 
        JOIN tickets t ON fb.flightBookingId = t.flightBookingId 
        WHERE t.ssn = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $ssn);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode([
    'success' => true,
    'bookings' => $bookings
]);

$conn->close();
?>
