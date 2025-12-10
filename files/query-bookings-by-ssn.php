<?php
session_start();

if (!isset($_SESSION['currentUser'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all flight bookings from SEP 2024
    $flightStmt = $pdo->prepare("
        SELECT 
            fb.flight_booking_id,
            fb.flight_id,
            fb.total_price,
            fb.created_at,
            f.origin,
            f.destination,
            f.departure_date,
            f.arrival_date,
            f.airline
        FROM flight_booking fb
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE YEAR(f.departure_date) = 2024 AND MONTH(f.departure_date) = 9
        ORDER BY f.departure_date DESC
    ");
    $flightStmt->execute();
    $flights = $flightStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get all hotel bookings from SEP 2024
    $hotelStmt = $pdo->prepare("
        SELECT 
            hb.hotel_booking_id,
            hb.hotel_id,
            hb.check_in,
            hb.check_out,
            hb.num_rooms,
            hb.price_per_night,
            hb.total_price,
            h.name,
            h.city
        FROM hotel_booking hb
        JOIN hotels h ON hb.hotel_id = h.hotel_id
        WHERE YEAR(hb.check_in) = 2024 AND MONTH(hb.check_in) = 9
        ORDER BY hb.check_in DESC
    ");
    $hotelStmt->execute();
    $hotels = $hotelStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'flights' => $flights,
        'hotels' => $hotels
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>