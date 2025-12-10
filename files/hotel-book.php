<?php
// hotel-book.php
session_start();

// Check if user is logged in
if (!isset($_SESSION['currentUser'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_deals', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get POST data
    $hotelId = $_POST['hotel_id'] ?? null;
    $checkInDate = $_POST['check_in'] ?? null;
    $checkOutDate = $_POST['check_out'] ?? null;
    $numRooms = $_POST['num_rooms'] ?? null;
    $pricePerNight = $_POST['price_per_night'] ?? null;
    $totalPrice = $_POST['total_price'] ?? null;

    if (!$hotelId || !$checkInDate || !$checkOutDate || !$numRooms || !$pricePerNight || !$totalPrice) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    $bookingDate = date('Y-m-d H:i:s');

    // Insert hotel booking
    $bookingStmt = $pdo->prepare("
        INSERT INTO hotel_booking (hotel_id, check_in, check_out, num_rooms, price_per_night, total_price, created_at)
        VALUES (:hotel_id, :check_in, :check_out, :num_rooms, :price_per_night, :total_price, :created_at)
    ");
    $bookingStmt->execute([
        ':hotel_id' => $hotelId,
        ':check_in' => $checkInDate,
        ':check_out' => $checkOutDate,
        ':num_rooms' => $numRooms,
        ':price_per_night' => $pricePerNight,
        ':total_price' => $totalPrice,
        ':created_at' => $bookingDate
    ]);

    $hotelBookingId = $pdo->lastInsertId();

    // Get hotel details for confirmation
    $hotelStmt = $pdo->prepare("
        SELECT hotel_id, name, city, price_per_night
        FROM hotels
        WHERE hotel_id = :hotel_id
    ");
    $hotelStmt->execute([':hotel_id' => $hotelId]);
    $hotelDetails = $hotelStmt->fetch(PDO::FETCH_ASSOC);

    $bookingData = [
        'hotel_booking_id' => $hotelBookingId,
        'hotel_id' => $hotelDetails['hotel_id'],
        'hotel_name' => $hotelDetails['name'],
        'city' => $hotelDetails['city'],
        'check_in' => $checkInDate,
        'check_out' => $checkOutDate,
        'num_rooms' => $numRooms,
        'price_per_night' => $pricePerNight,
        'total_price' => $totalPrice,
        'guests' => []
    ];

    // Get guest data from POST
    $guestCount = $_POST['guest_count'] ?? 0;
    
    for ($i = 0; $i < $guestCount; $i++) {
        $ssn = $_POST['guests'][$i]['ssn'] ?? '';
        $firstName = $_POST['guests'][$i]['firstName'] ?? '';
        $lastName = $_POST['guests'][$i]['lastName'] ?? '';
        $dob = $_POST['guests'][$i]['dob'] ?? '';
        $category = $_POST['guests'][$i]['category'] ?? '';

        if (!$ssn || !$firstName || !$lastName || !$dob || !$category) {
            continue;
        }

        // Insert guest
        $guestStmt = $pdo->prepare("
            INSERT INTO guesses (ssn, hotel_booking_id, first_name, last_name, dob, category)
            VALUES (:ssn, :hotel_booking_id, :first_name, :last_name, :dob, :category)
            ON DUPLICATE KEY UPDATE hotel_booking_id=:hotel_booking_id, first_name=:first_name, last_name=:last_name, dob=:dob, category=:category
        ");
        $guestStmt->execute([
            ':ssn' => $ssn,
            ':hotel_booking_id' => $hotelBookingId,
            ':first_name' => $firstName,
            ':last_name' => $lastName,
            ':dob' => $dob,
            ':category' => $category
        ]);

        // Add guest info to booking data
        $bookingData['guests'][] = [
            'ssn' => $ssn,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'dob' => $dob,
            'category' => $category
        ];
    }

    echo json_encode(['success' => true, 'booking' => $bookingData]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>