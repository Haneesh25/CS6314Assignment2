document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        clearError('phoneError');
        clearError('passwordError');
        clearMessage('loginMessage');

        let phone = document.getElementById('phone').value.trim();
        let password = document.getElementById('password').value.trim();

        let valid = true;

        if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
            showError('phoneError', 'Phone must be in format 123-456-7890');
            valid = false;
        }

        if (password.length < 8) {
            showError('passwordError', 'Password must be at least 8 characters');
            valid = false;
        }

        if (!valid) return;

        // Send AJAX to PHP
        $.ajax({
            url: 'login.php',
            type: 'POST',
            data: { phone, password },
            success: function (response) {
                if (response === "success") {
                    showSuccess('loginMessage', 'Login successful!');
                    setTimeout(() => window.location.href = 'index.html', 900);
                } else {
                    showError('loginMessage', response);
                }
            },
            error: function () {
                showError('loginMessage', 'Server error. Try again later.');
            }
        });
    });
});

// Utility functions
function showError(id, msg) { document.getElementById(id).textContent = msg; }
function clearError(id) { document.getElementById(id).textContent = ""; }
function showSuccess(id, msg) { document.getElementById(id).textContent = msg; }
function clearMessage(id) { document.getElementById(id).textContent = ""; }
