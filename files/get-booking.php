<?php
session_start();
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel_deals";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['currentUser'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$bookingType = $_POST['bookingType'] ?? '';
$bookingId = $_POST['bookingId'] ?? '';
$userId = $_SESSION['currentUser']['phone'];

if (empty($bookingId)) {
    echo json_encode(['success' => false, 'message' => 'Booking ID is required']);
    exit;
}

if ($bookingType === 'flight') {
    // Get flight booking
    $sql = "SELECT fb.*, f.origin, f.destination, f.departureDate, f.departureTime, f.arrivalTime 
            FROM flight_booking fb 
            JOIN flights f ON fb.flightId = f.flightId 
            WHERE fb.flightBookingId = ? AND fb.userId = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $bookingId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $booking = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'type' => 'flight',
            'data' => $booking
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Flight booking not found']);
    }
    
} else {
    // Get hotel booking
    $sql = "SELECT hb.*, h.hotelName, h.city 
            FROM hotel_booking hb 
            JOIN hotels h ON hb.hotelId = h.hotelId 
            WHERE hb.hotelBookingId = ? AND hb.userId = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $bookingId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $booking = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'type' => 'hotel',
            'data' => $booking
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Hotel booking not found']);
    }
}

$conn->close();
?>
