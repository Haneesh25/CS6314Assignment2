<?php
// clear-and-load-flights.php - This will clear old flights and load new ones
session_start();
header('Content-Type: application/json');

try {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "travel_deals";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    // Check if admin
    if (!isset($_SESSION['currentUser'])) {
        throw new Exception('Please login first');
    }
    
    if ($_SESSION['currentUser']['phone'] !== '222-222-2222') {
        throw new Exception('Admin access required');
    }

    // CLEAR OLD FLIGHTS FIRST
    $conn->query("DELETE FROM flights");
    
    // Generate and insert sample flights
    $airlines = ['American Airlines', 'United Airlines', 'Southwest Airlines', 'Delta Airlines'];
    $texasCities = ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'];
    $californiaCities = ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno'];

    $flightId = 1000;
    $inserted = 0;

    // Prepare statement once
    $sql = "INSERT INTO flights (flightId, airline, origin, destination, departureDate, arrivalDate, departureTime, arrivalTime, availableSeats, price) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Error preparing statement: ' . $conn->error);
    }

    // Generate flights for Sep, Oct, Nov 2024
    for ($month = 9; $month <= 11; $month++) {
        $maxDay = 30;
        if ($month == 10) $maxDay = 31;
        
        for ($day = 1; $day <= $maxDay; $day++) {
            // Generate 2 flight pairs per day
            for ($i = 0; $i < 2; $i++) {
                $origin = $texasCities[array_rand($texasCities)];
                $destination = $californiaCities[array_rand($californiaCities)];
                $airline = $airlines[array_rand($airlines)];
                
                $departureHour = rand(6, 20);
                $arrivalHour = ($departureHour + rand(2, 4)) % 24;
                
                // Outbound flight
                $flightIdStr = 'FL' . $flightId++;
                $departureDate = sprintf('2024-%02d-%02d', $month, $day);
                $departureTime = sprintf('%02d:00:00', $departureHour);
                $arrivalTime = sprintf('%02d:30:00', $arrivalHour);
                $seats = rand(5, 25);
                $price = rand(150, 450);
                
                $stmt->bind_param("ssssssssii", $flightIdStr, $airline, $origin, $destination, $departureDate, $departureDate, $departureTime, $arrivalTime, $seats, $price);
                
                if ($stmt->execute()) {
                    $inserted++;
                }
                
                // Return flight
                $flightIdStr = 'FL' . $flightId++;
                $stmt->bind_param("ssssssssii", $flightIdStr, $airline, $destination, $origin, $departureDate, $departureDate, $departureTime, $arrivalTime, $seats, $price);
                
                if ($stmt->execute()) {
                    $inserted++;
                }
            }
        }
    }

    $stmt->close();
    $conn->close();
    
    echo json_encode(['success' => true, 'message' => "Successfully loaded $inserted flights into database!"]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
