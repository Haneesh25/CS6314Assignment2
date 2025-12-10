<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['currentUser'])) {
    echo json_encode([
        'loggedIn' => true,
        'phone' => $_SESSION['currentUser']['phone'],
        'firstName' => $_SESSION['currentUser']['firstName'],
        'lastName' => $_SESSION['currentUser']['lastName']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
