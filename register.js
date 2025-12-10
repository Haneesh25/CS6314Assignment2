document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('registerForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        const fields = [
            'firstNameError', 'lastNameError', 'emailError', 'dobError',
            'genderError', 'phoneError', 'passwordError', 'confirmPasswordError'
        ];
        fields.forEach(clearError);

        let firstName = document.getElementById('firstName').value.trim();
        let lastName = document.getElementById('lastName').value.trim();
        let email = document.getElementById('email').value.trim();
        let dob = document.getElementById('dob').value.trim();
        let phone = document.getElementById('phone').value.trim();
        let password = document.getElementById('password').value.trim();
        let confirmPassword = document.getElementById('confirmPassword').value.trim();
        let gender = document.querySelector("input[name='gender']:checked");

        let valid = true;

        if (firstName === "") {
            showError('firstNameError', 'First name is required');
            valid = false;
        }
        if (lastName === "") {
            showError('lastNameError', 'Last name is required');
            valid = false;
        }
        if (email === "" || !email.includes('@') || !email.endsWith('.com')) {
            showError('emailError', 'Valid email required (must include @ and .com)');
            valid = false;
        }
        if (!/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
            showError('dobError', 'DOB must be MM-DD-YYYY');
            valid = false;
        }
        if (!gender) {
            showError('genderError', 'Please select a gender');
            valid = false;
        }
        if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
            showError('phoneError', 'Phone must be 123-456-7890');
            valid = false;
        }
        if (password.length < 8) {
            showError('passwordError', 'Password must be at least 8 characters');
            valid = false;
        }
        if (confirmPassword !== password) {
            showError('confirmPasswordError', 'Passwords do not match');
            valid = false;
        }

        if (!valid) return;

        // Send to backend
        $.ajax({
            url: "register.php",
            type: "POST",
            data: {
                firstName,
                lastName,
                email,
                dob,
                gender: gender.value,
                phone,
                password
            },
            success: function (response) {
                $("#registerMessage").html(`<p class="success">${response}</p>`);
                form.reset();
            },
            error: function () {
                $("#registerMessage").html(`<p class="error">Registration failed.</p>`);
            }
        });

    });
});

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearError(id) {
    document.getElementById(id).textContent = "";
}
