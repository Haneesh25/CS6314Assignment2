<?php
// test-database.php - Run this to check your database setup
header('Content-Type: text/html; charset=utf-8');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel_deals";

echo "<h2>Database Connection Test</h2>";

// Test connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo "<p style='color: red;'>❌ Connection failed: " . $conn->connect_error . "</p>";
    echo "<p><strong>Fix:</strong> Make sure MySQL is running in XAMPP</p>";
    exit;
}

echo "<p style='color: green;'>✅ Connected to database successfully</p>";

// Check if tables exist
$tables = [
    'users',
    'flights',
    'passengers',
    'flight_booking',
    'tickets',
    'hotels',
    'hotel_booking',
    'guesses'
];

echo "<h3>Table Status:</h3>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Table Name</th><th>Status</th><th>Row Count</th></tr>";

foreach ($tables as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result->num_rows > 0) {
        $count = $conn->query("SELECT COUNT(*) as count FROM $table")->fetch_assoc()['count'];
        echo "<tr><td>$table</td><td style='color: green;'>✅ Exists</td><td>$count rows</td></tr>";
    } else {
        echo "<tr><td>$table</td><td style='color: red;'>❌ Missing</td><td>-</td></tr>";
    }
}

echo "</table>";

// Check admin user
echo "<h3>Admin User Check:</h3>";
$result = $conn->query("SELECT * FROM users WHERE phone = '222-222-2222'");
if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    echo "<p style='color: green;'>✅ Admin user exists</p>";
    echo "<ul>";
    echo "<li>Phone: " . $admin['phone'] . "</li>";
    echo "<li>Name: " . $admin['firstName'] . " " . $admin['lastName'] . "</li>";
    echo "<li>Email: " . $admin['email'] . "</li>";
    echo "</ul>";
} else {
    echo "<p style='color: red;'>❌ Admin user not found</p>";
    echo "<p><strong>Fix:</strong> Run this SQL in phpMyAdmin:</p>";
    echo "<pre>INSERT INTO users (phone, password, firstName, lastName, dob, gender, email)
VALUES ('222-222-2222', 'admin123', 'Admin', 'User', '01-01-1990', 'Other', 'admin@traveldeals.com');</pre>";
}

// Check session
session_start();
echo "<h3>Session Check:</h3>";
if (isset($_SESSION['currentUser'])) {
    echo "<p style='color: green;'>✅ User is logged in</p>";
    echo "<ul>";
    echo "<li>Phone: " . $_SESSION['currentUser']['phone'] . "</li>";
    echo "<li>Name: " . $_SESSION['currentUser']['firstName'] . " " . $_SESSION['currentUser']['lastName'] . "</li>";
    echo "<li>Is Admin: " . ($_SESSION['currentUser']['phone'] === '222-222-2222' ? 'Yes' : 'No') . "</li>";
    echo "</ul>";
} else {
    echo "<p style='color: orange;'>⚠️ No user logged in</p>";
    echo "<p>Go to <a href='login.html'>login page</a> and login first</p>";
}

echo "<hr>";
echo "<h3>Summary:</h3>";

$allTablesExist = true;
foreach ($tables as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result->num_rows == 0) {
        $allTablesExist = false;
        break;
    }
}

if ($allTablesExist) {
    echo "<p style='color: green; font-size: 18px;'>✅ Your database is set up correctly!</p>";
    echo "<p>You can now:</p>";
    echo "<ol>";
    echo "<li>Login as admin (222-222-2222 / admin123)</li>";
    echo "<li>Go to <a href='my-account.html'>My Account</a></li>";
    echo "<li>Click 'Load Flights JSON to Database'</li>";
    echo "<li>Click 'Load Hotels XML to Database'</li>";
    echo "</ol>";
} else {
    echo "<p style='color: red; font-size: 18px;'>❌ Some tables are missing</p>";
    echo "<p><strong>Fix:</strong> Go to phpMyAdmin and import database_schema.sql</p>";
}

$conn->close();
?>
