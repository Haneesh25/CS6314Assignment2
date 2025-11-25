<?php
session_start();
$servername = "localhost";
$username = "root"; // your MySQL username
$password_db = ""; // your MySQL password
$dbname = "travel_deals";

// Connect
$conn = new mysqli($servername, $username, $password_db, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read POST data
$phone = $_POST['phone'] ?? '';
$password = $_POST['password'] ?? '';

if (!$phone || !$password) {
    echo "Phone and password are required";
    exit;
}

// Prepare statement to prevent SQL injection
$stmt = $conn->prepare("SELECT firstName, lastName, password FROM users WHERE phone = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo "Invalid phone or password";
} else {
    $stmt->bind_result($firstName, $lastName, $hashedPassword);
    $stmt->fetch();

    // For now, assume password is plain text (update later for hashing)
    if ($password === $hashedPassword) {
        $_SESSION['currentUser'] = [
            'phone' => $phone,
            'firstName' => $firstName,
            'lastName' => $lastName
        ];
        echo "success";
    } else {
        echo "Invalid phone or password";
    }
}

$stmt->close();
$conn->close();
?>
