<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['currentUser'])) {
    echo json_encode([
        'loggedIn' => true,
        'firstName' => $_SESSION['currentUser']['firstName'],
        'lastName' => $_SESSION['currentUser']['lastName'],
        'phone' => $_SESSION['currentUser']['phone'],
        'isAdmin' => $_SESSION['currentUser']['isAdmin']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>