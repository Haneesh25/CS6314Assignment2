<?php
session_start();

// Only logged-in users
if (!isset($_SESSION['currentUser'])) {
    echo "You must be logged in to submit a comment.";
    exit;
}

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "travel_deals";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$phone = $_POST['phone'] ?? '';
$gender = $_POST['gender'] ?? '';
$email = $_POST['email'] ?? '';
$comment = $_POST['comment'] ?? '';
$timestamp = date("Y-m-d H:i:s");

// Simple validation
if (!$firstName || !$lastName || !$phone || !$email || !$gender || !$comment) {
    echo "All fields are required.";
    exit;
}

if (!preg_match('/^\(\d{3}\)\d{3}-\d{4}$/', $phone)) {
        echo "Phone number must be in format (123)456-7890";
        exit;
    }

// Insert comment into DB
$sql = "INSERT INTO comments (firstName, lastName, phone, gender, email, comment, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $firstName, $lastName, $phone, $gender, $email, $comment, $timestamp);

if ($stmt->execute()) {
    echo "Comment submitted successfully!";
} else {
    echo "Error: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
