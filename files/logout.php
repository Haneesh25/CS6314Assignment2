<?php
session_start();
session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logged Out - Travel Deals</title>
    <link rel="stylesheet" href="mystyle.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Travel Deals</h1>
        </header>
        
        <main class="main-content" style="padding: 40px; text-align: center;">
            <h2>✅ Successfully Logged Out</h2>
            <p>You have been logged out of your account.</p>
            
            <div style="margin-top: 30px;">
                <a href="index.html" class="btn">Back to Home</a>
                <a href="login.html" class="btn btn-submit">Login Again</a>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2024 Travel Deals. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
