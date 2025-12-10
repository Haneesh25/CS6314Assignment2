<?php
session_start();
header('Content-Type: application/json');

// Ensure cart exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Get POST data
$flightId = $_POST['flightId'] ?? '';
$type = $_POST['type'] ?? ''; // 'departing' or 'returning'
$adults = min(intval($_POST['adults'] ?? 0), 4);
$children = min(intval($_POST['children'] ?? 0), 4);
$infants = min(intval($_POST['infants'] ?? 0), 4);

$totalPassengers = $adults + $children + $infants;

if (!$flightId || !in_array($type, ['departing', 'returning'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid flight data']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch flight details
    $stmt = $pdo->prepare("SELECT * FROM flights WHERE flight_id = :flightId");
    $stmt->execute([':flightId' => $flightId]);
    $flight = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$flight) {
        echo json_encode(['success' => false, 'message' => 'Flight not found']);
        exit;
    }

    if ($flight['availableSeats'] < $totalPassengers) {
        echo json_encode(['success' => false, 'message' => 'Not enough seats available']);
        exit;
    }

    // Add to session cart
    $_SESSION['cart'][$type] = [
        'flightId' => $flight['flight_id'],
        'airline' => $flight['airline'],
        'origin' => $flight['origin'],
        'destination' => $flight['destination'],
        'departureDate' => $flight['departure_date'],
        'arrival_date' => $flight['arrival_date'],
        'departure_time' => $flight['departure_time'],
        'arrival_time' => $flight['arrival_time'],
        'price' => $flight['price'],
        'adults' => $adults,
        'children' => $children,
        'infants' => $infants,
        'total_passengers' => $totalPassengers
    ];

    echo json_encode(['success' => true, 'message' => 'Flight added to cart', 'cart' => $_SESSION['cart']]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: '.$e->getMessage()]);
}
