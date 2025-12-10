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

    $bookingNumber = 'BK' . time();
    $bookingDate = date('Y-m-d H:i:s');

    // Process each flight in cart
    foreach (['departing', 'returning'] as $flightType) {
        if (!isset($cart[$flightType])) continue;

        $flight = $cart[$flightType];

        // Insert flight booking
        $stmt = $pdo->prepare("
            INSERT INTO flight_booking (flight_id, total_price, created_at)
            VALUES (:flight_id, :total_price, :created_at)
        ");

        $totalPrice = ($flight['adults'] * $flight['price']) +
                      ($flight['children'] * $flight['price'] * 0.7) +
                      ($flight['infants'] * $flight['price'] * 0.1);

        $stmt->execute([
            ':flight_id' => $flight['flightId'],
            ':total_price' => $totalPrice,
            ':created_at' => $bookingDate
        ]);

        $bookingId = $pdo->lastInsertId();

        // Insert tickets for each passenger
        for ($i = 0; $i < $flight['total_passengers']; $i++) {
            $ssn = $_POST['passengers'][$flightType][$i]['ssn'] ?? null;
            if ($ssn) {
                $ticketStmt = $pdo->prepare("
                    INSERT INTO tickets (flight_booking_id, ssn, price)
                    VALUES (:booking_id, :ssn, :price)
                ");
                $ticketStmt->execute([
                    ':booking_id' => $bookingId,
                    ':ssn' => $ssn,
                    ':price' => $flight['price']
                ]);
            }
        }
    }

    // Clear cart
    unset($_SESSION['cart']);

    echo json_encode([
        'success' => true,
        'message' => 'Booking confirmed!',
        'bookingNumber' => $bookingNumber
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>