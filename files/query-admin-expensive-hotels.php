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
        ORDER BY hb.total_price DESC
        LIMIT 10
    ");
    $stmt->execute();
    $hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'hotels' => $hotels]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>