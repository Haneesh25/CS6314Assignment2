<?php
session_start();
header('Content-Type: application/json');

$cart = $_SESSION['cart'] ?? null;
$cartData = [];

if ($cart && (isset($cart['departing']) || isset($cart['returning']))) {
    if (isset($cart['departing'])) {
        $cartData['departingFlight'] = $cart['departing'];
    }
    if (isset($cart['returning'])) {
        $cartData['returningFlight'] = $cart['returning'];
    }
}

echo json_encode($cartData);
?>