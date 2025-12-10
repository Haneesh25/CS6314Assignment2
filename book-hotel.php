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

// Check if user is logged in
if (!isset($_SESSION['currentUser'])) {
    echo json_encode(['success' => false, 'message' => 'Please login to book']);
    exit;
}

$userId = $_SESSION['currentUser']['phone'];

// Get booking data from POST
$data = json_decode(file_get_contents('php://input'), true);

$hotelBookingId = $data['hotelBookingId'];
$hotelId = $data['hotelId'];
$checkInDate = $data['checkInDate'];
$checkOutDate = $data['checkOutDate'];
$numberOfRooms = $data['numberOfRooms'];
$pricePerNight = $data['pricePerNight'];
$totalPrice = $data['totalPrice'];
$guests = $data['guests'];

// Start transaction
$conn->begin_transaction();

try {
    // Insert hotel booking
    $sql = "INSERT INTO hotel_booking (hotelBookingId, userId, hotelId, checkInDate, checkOutDate, numberOfRooms, pricePerNight, totalPrice) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssidi", $hotelBookingId, $userId, $hotelId, $checkInDate, $checkOutDate, $numberOfRooms, $pricePerNight, $totalPrice);
    $stmt->execute();
    
    // Insert guests
    foreach ($guests as $guest) {
        $sql = "INSERT INTO guesses (ssn, hotelBookingId, firstName, lastName, dob, category) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssss", 
            $guest['ssn'], 
            $hotelBookingId, 
            $guest['firstName'], 
            $guest['lastName'], 
            $guest['dob'], 
            $guest['category']
        );
        $stmt->execute();
    }
    
    $conn->commit();
    echo json_encode(['success' => true, 'bookingId' => $hotelBookingId]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Booking failed: ' . $e->getMessage()]);
}

$conn->close();
?>
