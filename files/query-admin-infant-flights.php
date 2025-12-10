<?php
session_start();

if (!isset($_SESSION['currentUser']) || !$_SESSION['currentUser']['isAdmin']) {
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("
        SELECT DISTINCT
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
            f.airline
        FROM flight_booking fb
        JOIN flights f ON fb.flight_id = f.flight_id
        JOIN tickets t ON fb.flight_booking_id = t.flight_booking_id
        JOIN passengers p ON t.ssn = p.ssn
        WHERE p.category = 'infant'
        ORDER BY f.departure_date DESC
    ");
    $stmt->execute();
    $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'flights' => $flights]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>