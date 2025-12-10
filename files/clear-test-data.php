<?php
// clear-test-data.php - Use this to reset database for testing
session_start();
header('Content-Type: text/html; charset=utf-8');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel_deals";

// Check if admin
if (!isset($_SESSION['currentUser']) || $_SESSION['currentUser']['phone'] !== '222-222-2222') {
    die("<h2>Admin Access Required</h2><p>Please login as admin first.</p>");
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<h2>Clear Test Data</h2>";

if (isset($_POST['confirm'])) {
    // Clear all bookings and related data (but keep flights and hotels)
    $conn->query("DELETE FROM tickets");
    echo "<p>✓ Cleared tickets</p>";
    
    $conn->query("DELETE FROM passengers");
    echo "<p>✓ Cleared passengers</p>";
    
    $conn->query("DELETE FROM flight_booking");
    echo "<p>✓ Cleared flight bookings</p>";
    
    $conn->query("DELETE FROM guesses");
    echo "<p>✓ Cleared hotel guests</p>";
    
    $conn->query("DELETE FROM hotel_booking");
    echo "<p>✓ Cleared hotel bookings</p>";
    
    echo "<p style='color: green; font-size: 18px;'><strong>✓ All test bookings cleared!</strong></p>";
    echo "<p>Flights and hotels data is still in database.</p>";
    echo "<p><a href='my-account.html'>Back to My Account</a></p>";
} else {
    // Show confirmation
    $bookings = $conn->query("SELECT COUNT(*) as count FROM flight_booking")->fetch_assoc()['count'];
    $hotels = $conn->query("SELECT COUNT(*) as count FROM hotel_booking")->fetch_assoc()['count'];
    
    echo "<p>This will clear:</p>";
    echo "<ul>";
    echo "<li>$bookings flight booking(s)</li>";
    echo "<li>$hotels hotel booking(s)</li>";
    echo "<li>All passenger data</li>";
    echo "<li>All ticket data</li>";
    echo "</ul>";
    echo "<p><strong>This will NOT delete:</strong> Users, Flights, or Hotels</p>";
    
    echo "<form method='POST'>";
    echo "<input type='hidden' name='confirm' value='1'>";
    echo "<button type='submit' style='background: red; color: white; padding: 10px 20px; font-size: 16px;'>Clear All Bookings</button>";
    echo "</form>";
    echo "<p><a href='my-account.html'>Cancel</a></p>";
}

$conn->close();
?>
