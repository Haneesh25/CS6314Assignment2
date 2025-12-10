<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Test - Travel Deals</title>
    <link rel="stylesheet" href="mystyle.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Session Test Page</h1>
        </header>
        
        <main class="main-content" style="padding: 40px;">
            <h2>🔍 Login Session Check</h2>
            
            <?php
            if (isset($_SESSION['currentUser'])) {
                // User is logged in
                $user = $_SESSION['currentUser'];
                echo "<div style='background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin: 20px 0;'>";
                echo "<h3 style='color: #155724; margin-top: 0;'>✅ Login is Working!</h3>";
                echo "<p><strong>Phone:</strong> " . htmlspecialchars($user['phone']) . "</p>";
                echo "<p><strong>First Name:</strong> " . htmlspecialchars($user['firstName']) . "</p>";
                echo "<p><strong>Last Name:</strong> " . htmlspecialchars($user['lastName']) . "</p>";
                
                // Check if admin
                if ($user['phone'] === '222-222-2222') {
                    echo "<p style='color: #856404; background-color: #fff3cd; padding: 10px; border-radius: 3px;'><strong>🔐 Admin Status:</strong> YES - You have admin privileges!</p>";
                } else {
                    echo "<p><strong>Admin Status:</strong> No (Regular User)</p>";
                }
                
                echo "</div>";
                
                echo "<h3>Full Session Data:</h3>";
                echo "<pre style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto;'>";
                print_r($_SESSION);
                echo "</pre>";
                
            } else {
                // User is NOT logged in
                echo "<div style='background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 5px; margin: 20px 0;'>";
                echo "<h3 style='color: #721c24; margin-top: 0;'>❌ No Active Login Session</h3>";
                echo "<p>You are not currently logged in.</p>";
                echo "<p><a href='login.html' style='color: #0056b3;'>Go to Login Page</a></p>";
                echo "</div>";
            }
            ?>
            
            <h3>How to Test:</h3>
            <ol>
                <li>Go to <a href="login.html">Login Page</a></li>
                <li>Login with:
                    <ul>
                        <li>Phone: <code>222-222-2222</code></li>
                        <li>Password: <code>admin123</code></li>
                    </ul>
                </li>
                <li>Come back to this page (refresh)</li>
                <li>You should see your login details above!</li>
            </ol>
            
            <div style="margin-top: 30px;">
                <a href="index.html" class="btn">Back to Home</a>
                <a href="login.html" class="btn">Login Page</a>
                <?php if (isset($_SESSION['currentUser'])): ?>
                    <a href="logout.php" class="btn btn-cancel">Logout</a>
                <?php endif; ?>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2024 Travel Deals. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
