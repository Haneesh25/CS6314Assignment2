$(document).ready(function() {
    $("#contactForm").submit(function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Get input values
        const firstName = $("#firstName").val().trim();
        const lastName = $("#lastName").val().trim();
        const phone = $("#phone").val().trim();
        const email = $("#email").val().trim();
        const gender = $("input[name='gender']:checked").val();
        const comment = $("#comment").val().trim();
        
        let isValid = true;

        // Clear old errors
        $(".error").text("");
        $("#formMessage").text("");

        // Regex patterns
        const namePattern = /^[A-Z][a-zA-Z]*$/;
        const phonePattern = /^\(\d{3}\)\d{3}-\d{4}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // --- VALIDATION RULES ---

        // First Name
        if (!firstName.match(namePattern)) {
            $("#firstNameError").text("First name must start with a capital letter and contain only alphabets.");
            isValid = false;
        }

        // Last Name
        if (!lastName.match(namePattern)) {
            $("#lastNameError").text("Last name must start with a capital letter and contain only alphabets.");
            isValid = false;
        }

        // First and Last cannot be same
        if (firstName && lastName && firstName === lastName) {
            $("#lastNameError").text("First and last name cannot be the same.");
            isValid = false;
        }

        // Phone Number
        if (!phone.match(phonePattern)) {
            $("#phoneError").text("Phone number must be in the format (123)456-7890.");
            isValid = false;
        }

        // Email
        if (!email.match(emailPattern)) {
            $("#emailError").text("Please enter a valid email (must contain @ and .)");
            isValid = false;
        }

        // Gender
        if (!gender) {
            $("#genderError").text("Please select a gender.");
            isValid = false;
        }

        // Comment
        if (comment.length < 10) {
            $("#commentError").text("Comment must be at least 10 characters long.");
            isValid = false;
        }

        // --- IF INVALID ---
        if (!isValid) {
            $("#formMessage").css("color", "red").text("Please correct the errors above.");
            return;
        }

        // --- IF VALID, SAVE DATA ---
        const formData = {
            firstName,
            lastName,
            phone,
            gender,
            email,
            comment,
            timestamp: new Date().toISOString()
        };

        // POST data to backend (Node.js)
        fetch("http://localhost:3000/save-contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $("#formMessage").css("color", "green").text("Form submitted successfully!");
                $("#contactForm")[0].reset();
            } else {
                $("#formMessage").css("color", "red").text("Error saving data. Please try again.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
            $("#formMessage").css("color", "red").text("Server error. Please try again later.");
        });
    });
});
