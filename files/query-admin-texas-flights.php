<?php
session_start();

if (!isset($_SESSION['currentUser']) || !$_SESSION['currentUser']['isAdmin']) {
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $texasCities = ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'];
    $placeholders = implode(',', array_fill(0, count($texasCities), '?'));

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
        WHERE f.origin IN ($placeholders)
        AND YEAR(f.departure_date) = 2024
        AND MONTH(f.departure_date) IN (9, 10)
        ORDER BY f.departure_date DESC
    ");
    $stmt->execute($texasCities);
    $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'flights' => $flights]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>