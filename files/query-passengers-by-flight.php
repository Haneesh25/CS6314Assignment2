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

    $stmt = $pdo->prepare("
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
        ORDER BY p.category DESC, p.first_name
    ");
    $stmt->execute([':booking_id' => $bookingId]);
    $passengers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'passengers' => $passengers]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>