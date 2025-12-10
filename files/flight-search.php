<?php
header('Content-Type: application/json');
session_start();

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Get POST data
$origin = $_POST['origin'] ?? '';
$destination = $_POST['destination'] ?? '';
$departureDate = $_POST['departureDate'] ?? '';
$returnDate = $_POST['returnDate'] ?? '';
$tripType = $_POST['tripType'] ?? 'oneway';
$adults = min(intval($_POST['adults'] ?? 0), 4);
$children = min(intval($_POST['children'] ?? 0), 4);
$infants = min(intval($_POST['infants'] ?? 0), 4);

$totalPassengers = $adults + $children + $infants;

// Validate input
$texasCities = ['Houston','Dallas','Austin','San Antonio','Fort Worth','El Paso'];
$californiaCities = ['Los Angeles','San Francisco','San Diego','Sacramento','San Jose','Fresno'];
$allCities = array_merge($texasCities, $californiaCities);

$errors = [];
if (!in_array($origin, $allCities)) $errors[] = 'Invalid origin city';
if (!in_array($destination, $allCities)) $errors[] = 'Invalid destination city';
if ($origin === $destination) $errors[] = 'Origin and destination cannot be the same';
if (strtotime($departureDate) < strtotime('2024-09-01') || strtotime($departureDate) > strtotime('2024-12-01'))
    $errors[] = 'Departure date out of range';
if ($tripType === 'roundtrip' && (strtotime($returnDate) < strtotime('2024-09-01') || strtotime($returnDate) > strtotime('2024-12-01')))
    $errors[] = 'Return date out of range';
if ($adults > 4 || $children > 4 || $infants > 4) $errors[] = 'Passenger count exceeds maximum';

if ($totalPassengers === 0) $errors[] = 'At least one passenger required';

if ($errors) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Helper function to get flights
function getFlights($pdo, $origin, $destination, $date, $totalPassengers) {
    $stmt = $pdo->prepare("
        SELECT * FROM flights 
        WHERE origin = :origin AND destination = :destination 
          AND departure_date BETWEEN DATE_SUB(:date, INTERVAL 3 DAY) AND DATE_ADD(:date, INTERVAL 3 DAY)
          AND availableSeats >= :seats
        ORDER BY departure_date, departure_time
    ");
    $stmt->execute([
        ':origin' => $origin,
        ':destination' => $destination,
        ':date' => $date,
        ':seats' => $totalPassengers
    ]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get departing flights
$departingFlights = getFlights($pdo, $origin, $destination, $departureDate, $totalPassengers);

// Get returning flights if roundtrip
$returningFlights = [];
if ($tripType === 'roundtrip') {
    $returningFlights = getFlights($pdo, $destination, $origin, $returnDate, $totalPassengers);
}

// Return JSON
echo json_encode([
    'success' => true,
    'departingFlights' => $departingFlights,
    'returningFlights' => $returningFlights
]);
