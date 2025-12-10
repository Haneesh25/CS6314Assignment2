document.addEventListener('DOMContentLoaded', function() {
    // Check session and load user info
    fetch('check-session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                // Redirect to login if not logged in
                alert('Please login to access your account.');
                window.location.href = 'login.html';
                return;
            }

            // Display user details
            document.getElementById('userDetails').innerHTML = `
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
            `;

            // Show admin section if user is admin
            if (data.isAdmin) {
                document.getElementById('adminSection').style.display = 'block';
                
                // Setup admin flight upload
                document.getElementById('uploadForm').addEventListener('submit', function(e){
                    e.preventDefault();
                    uploadFlights();
                });
            }
        })
        .catch(err => {
            console.error('Session check failed:', err);
            alert('Error checking session. Please login again.');
            window.location.href = 'login.html';
        });
});

function uploadFlights() {
    const file = document.getElementById('flightsFile').files[0];
    if (!file) {
        document.getElementById('uploadMessage').innerHTML = 
            '<p style="color: red;">Please select a JSON file</p>';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e){
        const flightsData = e.target.result;

        fetch('admin-load-flights.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: flightsData
        })
        .then(res => res.text())
        .then(msg => {
            if (msg.includes('successfully')) {
                document.getElementById('uploadMessage').innerHTML = 
                    `<p style="color: green;">${msg}</p>`;
            } else {
                document.getElementById('uploadMessage').innerHTML = 
                    `<p style="color: red;">${msg}</p>`;
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('uploadMessage').innerHTML = 
                '<p style="color: red;">Error uploading flights</p>';
        });
    };
    reader.readAsText(file);
}