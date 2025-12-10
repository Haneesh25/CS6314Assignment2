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

    // Get flight booking details with flight info
    $stmt = $pdo->prepare("
        SELECT 
            fb.flight_booking_id,
            fb.flight_id,
            fb.total_price,
            fb.created_at,
            f.origin,
            f.destination,
            f.departure_date,
            f.arrival_date,
            f.departure_time,
            f.arrival_time,
            f.airline,
            f.price
        FROM flight_booking fb
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE fb.flight_booking_id = :booking_id
    ");
    $stmt->execute([':booking_id' => $bookingId]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        echo json_encode(['success' => false, 'message' => 'Booking not found']);
        exit;
    }

    // Get all passengers/tickets for this booking
    $ticketsStmt = $pdo->prepare("
        SELECT 
            t.ticket_id,
            t.ssn,
            t.price,
            p.first_name,
            p.last_name,
            p.dob,
            p.category
        FROM tickets t
        JOIN passengers p ON t.ssn = p.ssn
        WHERE t.flight_booking_id = :booking_id
    ");
    $ticketsStmt->execute([':booking_id' => $bookingId]);
    $tickets = $ticketsStmt->fetchAll(PDO::FETCH_ASSOC);

    $booking['tickets'] = $tickets;

    echo json_encode(['success' => true, 'booking' => $booking]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>