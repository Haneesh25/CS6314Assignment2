<?php
session_start();

// Check if user is logged in and is admin
if (!isset($_SESSION['currentUser']) || !$_SESSION['currentUser']['isAdmin']) {
    echo "Access denied. Admin only.";
    exit;
}

$servername = "localhost";
$username = "root";
$password_db = "";
$dbname = "travel_deals";

// Connect
$conn = new mysqli($servername, $username, $password_db, $dbname);
if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }

// Read JSON input
$input = file_get_contents('php://input');
$flights = json_decode($input, true);
if (!$flights) { echo "Invalid JSON"; exit; }

// Insert each flight
$stmt = $conn->prepare("INSERT INTO flights (flight_id, airline, origin, destination, departure_date, arrival_date, departure_time, arrival_time, availableSeats, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($flights as $f) {
    $stmt->bind_param("isssssssii", $f['flight_id'], $f['airline'], $f['origin'], $f['destination'], $f['departure_date'], $f['arrival_date'], $f['departure_time'], $f['arrival_time'], $f['availableSeats'], $f['price']);
    $stmt->execute();
}

$stmt->close();
$conn->close();
echo "Flights loaded successfully!";
?>
