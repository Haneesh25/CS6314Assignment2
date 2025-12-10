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
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read XML input
$input = file_get_contents('php://input');
$xml = simplexml_load_string($input);

if (!$xml) {
    echo "Invalid XML";
    exit;
}

// Insert each hotel
$stmt = $conn->prepare("INSERT INTO hotels (hotel_id, name, city, price_per_night) VALUES (?, ?, ?, ?)");

if (!$stmt) {
    echo "Prepare failed: " . $conn->error;
    exit;
}

$count = 0;
foreach ($xml->hotel as $hotel) {
    $hotel_id = (int)$hotel->hotel_id;
    $name = (string)$hotel->name;
    $city = (string)$hotel->city;
    $price = (float)$hotel->price_per_night;

    $stmt->bind_param("issd", $hotel_id, $name, $city, $price);
    
    if (!$stmt->execute()) {
        echo "Error inserting hotel " . $hotel_id . ": " . $stmt->error;
        $stmt->close();
        $conn->close();
        exit;
    }
    $count++;
}

$stmt->close();
$conn->close();
echo "Successfully loaded " . $count . " hotels!";
?>