<?php
session_start();

if (!isset($_SESSION['currentUser']) || !$_SESSION['currentUser']['isAdmin']) {
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $californiaCities = ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno'];
    $placeholders = implode(',', array_fill(0, count($californiaCities), '?'));

    // Get flights arriving in California (SEP-OCT 2024)
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(DISTINCT fb.flight_booking_id) as total_bookings,
            f.destination,
            MONTH(f.arrival_date) as arrival_month,
            COUNT(DISTINCT fb.flight_booking_id) as count
        FROM flight_booking fb
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE f.destination IN ($placeholders)
        AND YEAR(f.arrival_date) = 2024
        AND MONTH(f.arrival_date) IN (9, 10)
        GROUP BY f.destination, MONTH(f.arrival_date)
        ORDER BY f.destination, MONTH(f.arrival_date)
    ");
    $stmt->execute($californiaCities);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Also get detailed list
    $detailedStmt = $pdo->prepare("
        SELECT 
            fb.flight_booking_id,
            fb.flight_id,
            fb.total_price,
            f.origin,
            f.destination,
            f.departure_date,
            f.arrival_date,
            f.airline
        FROM flight_booking fb
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE f.destination IN ($placeholders)
        AND YEAR(f.arrival_date) = 2024
        AND MONTH(f.arrival_date) IN (9, 10)
        ORDER BY f.destination, f.arrival_date DESC
    ");
    $detailedStmt->execute($californiaCities);
    $flights = $detailedStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'summary' => $results, 'flights' => $flights]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>