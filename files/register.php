<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "travel_deals";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Sanitize inputs
$firstName = trim($_POST['firstName']);
$lastName = trim($_POST['lastName']);
$email = trim($_POST['email']);
$dob = trim($_POST['dob']);
$gender = isset($_POST['gender']) ? $_POST['gender'] : '';
$phone = trim($_POST['phone']);
$password = trim($_POST['password']);

// Server-side validation
$errors = [];

// Phone format
if (!preg_match('/^\d{3}-\d{3}-\d{4}$/', $phone)) {
    $errors[] = "Phone must be in format 123-456-7890";
}

// Password length
if (strlen($password) < 8) {
    $errors[] = "Password must be at least 8 characters";
}

// Email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !str_ends_with($email, '.com')) {
    $errors[] = "Email must include @ and end with .com";
}

// DOB format MM-DD-YYYY
if (!preg_match('/^\d{2}-\d{2}-\d{4}$/', $dob)) {
    $errors[] = "DOB must be MM-DD-YYYY";
}

// First and last name required
if (empty($firstName) || empty($lastName)) {
    $errors[] = "First and Last Name are required";
}

// Gender optional but if provided check
if (!empty($gender) && !in_array($gender, ['Male','Female','Other'])) {
    $errors[] = "Invalid gender selected";
}

// Check duplicate phone
$check = $conn->prepare("SELECT phone FROM users WHERE phone=?");
$check->bind_param("s", $phone);
$check->execute();
$result = $check->get_result();
if ($result->num_rows > 0) {
    $errors[] = "Phone number already registered";
}

if (!empty($errors)) {
    echo implode("<br>", $errors);
    exit;
}

// Hash password before saving
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into DB
$stmt = $conn->prepare("INSERT INTO users (phone, password, firstName, lastName, dob, gender, email) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $phone, $hashedPassword, $firstName, $lastName, $dob, $gender, $email);

if ($stmt->execute()) {
    echo "Registration successful!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
