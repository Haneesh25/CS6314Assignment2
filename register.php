<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "travel_deals";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Database connection failed");
}

$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$dob = $_POST['dob'];
$gender = $_POST['gender'];
$phone = $_POST['phone'];
$password = $_POST['password']; // In real apps hash it!

// Check if phone exists
$check = $conn->query("SELECT phone FROM users WHERE phone='$phone'");
if ($check->num_rows > 0) {
    echo "Phone number already registered.";
    exit;
}

// Insert new user
$sql = "INSERT INTO users (phone, password, firstName, lastName, dob, gender, email)
        VALUES ('$phone', '$password', '$firstName', '$lastName', '$dob', '$gender', '$email')";

if ($conn->query($sql)) {
    echo "Registration successful!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>