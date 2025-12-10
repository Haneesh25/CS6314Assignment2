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

$userId = $_SESSION['currentUser']['phone'];
$bookings = [];

// Get flight bookings for September 2024
$sql = "SELECT fb.*, f.origin, f.destination, f.departureDate, 'flight' as type 
        FROM flight_booking fb 
        JOIN flights f ON fb.flightId = f.flightId 
        WHERE fb.userId = ? 
        AND f.departureDate >= '2024-09-01' 
        AND f.departureDate <= '2024-09-30'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

// Get hotel bookings for September 2024
$sql = "SELECT hb.*, h.hotelName, h.city, 'hotel' as type 
        FROM hotel_booking hb 
        JOIN hotels h ON hb.hotelId = h.hotelId 
        WHERE hb.userId = ? 
        AND hb.checkInDate >= '2024-09-01' 
        AND hb.checkInDate <= '2024-09-30'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $userId);
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
