<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['currentUser'])) {
    echo json_encode(['success' => false, 'message' => 'Please login to submit a comment']);
    exit;
}

// Get user info from session
$user = $_SESSION['currentUser'];

// Get form data
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$gender = $_POST['gender'] ?? '';
$comment = $_POST['comment'] ?? '';

// Validate comment length
if (strlen($comment) < 10) {
    echo json_encode(['success' => false, 'message' => 'Comment must be at least 10 characters']);
    exit;
}

// Generate unique contact ID
$contactId = 'CONTACT_' . time() . '_' . rand(1000, 9999);

// Create or load XML file
$xmlFile = 'contacts.xml';
if (file_exists($xmlFile)) {
    $xml = simplexml_load_file($xmlFile);
} else {
    $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><contacts></contacts>');
}

// Add new contact
$contact = $xml->addChild('contact');
$contact->addChild('contactId', htmlspecialchars($contactId));
$contact->addChild('phone', htmlspecialchars($phone));
$contact->addChild('firstName', htmlspecialchars($firstName));
$contact->addChild('lastName', htmlspecialchars($lastName));
$contact->addChild('email', htmlspecialchars($email));
$contact->addChild('gender', htmlspecialchars($gender));
$contact->addChild('comment', htmlspecialchars($comment));
$contact->addChild('timestamp', date('Y-m-d H:i:s'));

// Save XML file
if ($xml->asXML($xmlFile)) {
    echo json_encode(['success' => true, 'message' => 'Comment submitted successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error saving comment']);
}
?>
