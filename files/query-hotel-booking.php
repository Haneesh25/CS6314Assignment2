<?php
session_start();

if (!isset($_SESSION['currentUser'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $bookingId = $_POST['booking_id'] ?? null;

    if (!$bookingId) {
        echo json_encode(['success' => false, 'message' => 'Booking ID required']);
        exit;
    }

    // Get hotel booking details with hotel info
    $stmt = $pdo->prepare("
        SELECT 
            hb.hotel_booking_id,
            hb.hotel_id,
            hb.check_in,
            hb.check_out,
            hb.num_rooms,
            hb.price_per_night,
            hb.total_price,
            hb.created_at,
            h.name,
            h.city
        FROM hotel_booking hb
        JOIN hotels h ON hb.hotel_id = h.hotel_id
        WHERE hb.hotel_booking_id = :booking_id
    ");
    $stmt->execute([':booking_id' => $bookingId]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        echo json_encode(['success' => false, 'message' => 'Booking not found']);
        exit;
    }

    // Get all guests for this booking
    $guestsStmt = $pdo->prepare("
        SELECT 
            ssn,
            first_name,
            last_name,
            dob,
            category
        FROM guesses
        WHERE hotel_booking_id = :booking_id
    ");
    $guestsStmt->execute([':booking_id' => $bookingId]);
    $guests = $guestsStmt->fetchAll(PDO::FETCH_ASSOC);

    $booking['guests'] = $guests;

    echo json_encode(['success' => true, 'booking' => $booking]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>