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

$flightBookingId = $data['flightBookingId'];
$flightId = $data['flightId'];
$totalPrice = $data['totalPrice'];
$passengers = $data['passengers'];

// Start transaction
$conn->begin_transaction();

try {
    // Insert flight booking
    $sql = "INSERT INTO flight_booking (flightBookingId, userId, flightId, totalPrice) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssd", $flightBookingId, $userId, $flightId, $totalPrice);
    $stmt->execute();
    
    // Insert passengers and tickets
    foreach ($passengers as $passenger) {
        // Insert passenger (or ignore if exists)
        $sql = "INSERT INTO passengers (ssn, firstName, lastName, dob, category) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE ssn=ssn";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss", 
            $passenger['ssn'], 
            $passenger['firstName'], 
            $passenger['lastName'], 
            $passenger['dob'], 
            $passenger['category']
        );
        $stmt->execute();
        
        // Insert ticket
        $sql = "INSERT INTO tickets (ticketId, flightBookingId, ssn, price) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssd", 
            $passenger['ticketId'], 
            $flightBookingId, 
            $passenger['ssn'], 
            $passenger['price']
        );
        $stmt->execute();
    }
    
    // Update available seats
    $sql = "UPDATE flights SET availableSeats = availableSeats - ? WHERE flightId = ?";
    $stmt = $conn->prepare($sql);
    $passengerCount = count($passengers);
    $stmt->bind_param("is", $passengerCount, $flightId);
    $stmt->execute();
    
    $conn->commit();
    echo json_encode(['success' => true, 'bookingId' => $flightBookingId]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Booking failed: ' . $e->getMessage()]);
}

$conn->close();
?>
