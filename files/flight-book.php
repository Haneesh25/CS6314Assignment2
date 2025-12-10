<?php
session_start();

if (!isset($_SESSION['currentUser']) || !isset($_SESSION['cart'])) {
    echo json_encode(['success' => false, 'message' => 'No cart or user session']);
    exit;
}

$cart = $_SESSION['cart'];

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $bookingDate = date('Y-m-d H:i:s');
    $bookings = [];

    // Process each flight in cart (departing and/or returning)
    foreach (['departing', 'returning'] as $flightType) {
        if (!isset($cart[$flightType])) continue;

        $flight = $cart[$flightType];

        // Calculate total price
        $totalPrice = ($flight['adults'] * $flight['price']) +
                      ($flight['children'] * $flight['price'] * 0.7) +
                      ($flight['infants'] * $flight['price'] * 0.1);

        // Insert flight booking
        $bookingStmt = $pdo->prepare("
            INSERT INTO flight_booking (flight_id, total_price, created_at)
            VALUES (:flight_id, :total_price, :created_at)
        ");
        $bookingStmt->execute([
            ':flight_id' => $flight['flightId'],
            ':total_price' => $totalPrice,
            ':created_at' => $bookingDate
        ]);

        $bookingId = $pdo->lastInsertId();

        // Get flight details for confirmation
        $flightStmt = $pdo->prepare("
            SELECT flight_id, origin, destination, departure_date, arrival_date, departure_time, arrival_time
            FROM flights
            WHERE flight_id = :flight_id
        ");
        $flightStmt->execute([':flight_id' => $flight['flightId']]);
        $flightDetails = $flightStmt->fetch(PDO::FETCH_ASSOC);

        $bookingData = [
            'flight_booking_id' => $bookingId,
            'flight_id' => $flightDetails['flight_id'],
            'origin' => $flightDetails['origin'],
            'destination' => $flightDetails['destination'],
            'departure_date' => $flightDetails['departure_date'],
            'arrival_date' => $flightDetails['arrival_date'],
            'departure_time' => $flightDetails['departure_time'],
            'arrival_time' => $flightDetails['arrival_time'],
            'total_price' => $totalPrice,
            'tickets' => [],
            'flight_type' => $flightType
        ];

        // Insert tickets and passengers for each passenger
        $totalPassengers = $flight['adults'] + $flight['children'] + $flight['infants'];
        
        for ($i = 0; $i < $totalPassengers; $i++) {
            $firstName = $_POST['passengers'][$flightType][$i]['firstName'] ?? '';
            $lastName = $_POST['passengers'][$flightType][$i]['lastName'] ?? '';
            $dob = $_POST['passengers'][$flightType][$i]['dob'] ?? '';
            $ssn = $_POST['passengers'][$flightType][$i]['ssn'] ?? '';

            // Determine category based on position
            $category = ($i < $flight['adults']) ? 'adult' : (($i < $flight['adults'] + $flight['children']) ? 'child' : 'infant');

            // Calculate ticket price based on category
            if ($category === 'adult') {
                $ticketPrice = $flight['price'];
            } elseif ($category === 'child') {
                $ticketPrice = $flight['price'] * 0.7;
            } else {
                $ticketPrice = $flight['price'] * 0.1;
            }

            // Insert passenger
            $passengerStmt = $pdo->prepare("
                INSERT INTO passengers (ssn, first_name, last_name, dob, category)
                VALUES (:ssn, :first_name, :last_name, :dob, :category)
                ON DUPLICATE KEY UPDATE first_name=:first_name, last_name=:last_name, dob=:dob, category=:category
            ");
            $passengerStmt->execute([
                ':ssn' => $ssn,
                ':first_name' => $firstName,
                ':last_name' => $lastName,
                ':dob' => $dob,
                ':category' => $category
            ]);

            // Insert ticket
            $ticketStmt = $pdo->prepare("
                INSERT INTO tickets (flight_booking_id, ssn, price)
                VALUES (:booking_id, :ssn, :price)
            ");
            $ticketStmt->execute([
                ':booking_id' => $bookingId,
                ':ssn' => $ssn,
                ':price' => $ticketPrice
            ]);

            $ticketId = $pdo->lastInsertId();

            // Add ticket info to booking data
            $bookingData['tickets'][] = [
                'ticket_id' => $ticketId,
                'flight_booking_id' => $bookingId,
                'ssn' => $ssn,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'dob' => $dob,
                'price' => $ticketPrice,
                'category' => $category
            ];
        }

        // Update available seats in flights table
        $updateSeats = $pdo->prepare("
            UPDATE flights 
            SET availableSeats = availableSeats - :passengers 
            WHERE flight_id = :flight_id
        ");
        $updateSeats->execute([
            ':passengers' => $totalPassengers,
            ':flight_id' => $flight['flightId']
        ]);

        $bookings[] = $bookingData;
    }

    // Clear cart
    unset($_SESSION['cart']);

    echo json_encode([
        'success' => true,
        'message' => 'Booking confirmed!',
        'bookings' => $bookings
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>