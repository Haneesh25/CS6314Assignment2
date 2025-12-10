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

            // Setup hotel upload
            const hotelUploadForm = document.getElementById('hotelUploadForm');
            if (hotelUploadForm) {
                hotelUploadForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    uploadHotels();
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

function uploadHotels() {
    const file = document.getElementById('hotelsFile').files[0];
    if (!file) {
        document.getElementById('hotelUploadMessage').innerHTML = 
            '<p style="color: red;">Please select an XML file</p>';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const hotelsData = e.target.result;

        fetch('admin-load-hotels.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/xml' },
            body: hotelsData
        })
        .then(res => res.text())
        .then(msg => {
            if (msg.includes('Successfully')) {
                document.getElementById('hotelUploadMessage').innerHTML = 
                    '<p style="color: green;">' + msg + '</p>';
            } else {
                document.getElementById('hotelUploadMessage').innerHTML = 
                    '<p style="color: red;">' + msg + '</p>';
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('hotelUploadMessage').innerHTML = 
                '<p style="color: red;">Error uploading hotels</p>';
        });
    };
    reader.readAsText(file);
}

// ===== USER QUERIES =====

function queryFlightBooking() {
    const bookingId = document.getElementById('flightBookingId').value;
    if (!bookingId) {
        alert('Please enter a booking ID');
        return;
    }

    fetch('query-flight-booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'booking_id=' + bookingId
    })
    .then(res => res.json())
    .then(data => {
        const resultDiv = document.getElementById('flightBookingResult');
        if (data.success) {
            let html = `
                <div style="border: 1px solid #4CAF50; padding: 15px; background-color: #f0f8f0;">
                    <p><strong>Flight Booking ID:</strong> ${data.booking.flight_booking_id}</p>
                    <p><strong>Flight ID:</strong> ${data.booking.flight_id}</p>
                    <p><strong>Route:</strong> ${data.booking.origin} → ${data.booking.destination}</p>
                    <p><strong>Departure:</strong> ${data.booking.departure_date} at ${data.booking.departure_time}</p>
                    <p><strong>Arrival:</strong> ${data.booking.arrival_date} at ${data.booking.arrival_time}</p>
                    <p><strong>Airline:</strong> ${data.booking.airline}</p>
                    <p><strong>Total Price:</strong> $${parseFloat(data.booking.total_price).toFixed(2)}</p>
                    <p><strong>Booking Date:</strong> ${data.booking.created_at}</p>
                    <h5>Passengers:</h5>
                    <ul>
            `;
            data.booking.tickets.forEach(ticket => {
                html += `
                    <li>
                        <strong>${ticket.first_name} ${ticket.last_name}</strong> (${ticket.category})
                        - SSN: ${ticket.ssn}, DOB: ${ticket.dob}, Price: $${parseFloat(ticket.price).toFixed(2)}
                    </li>
                `;
            });
            html += `</ul></div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        document.getElementById('flightBookingResult').innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryHotelBooking() {
    const bookingId = document.getElementById('hotelBookingId').value;
    if (!bookingId) {
        alert('Please enter a booking ID');
        return;
    }

    fetch('query-hotel-booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'booking_id=' + bookingId
    })
    .then(res => res.json())
    .then(data => {
        const resultDiv = document.getElementById('hotelBookingResult');
        if (data.success) {
            let html = `
                <div style="border: 1px solid #2196F3; padding: 15px; background-color: #e3f2fd;">
                    <p><strong>Hotel Booking ID:</strong> ${data.booking.hotel_booking_id}</p>
                    <p><strong>Hotel:</strong> ${data.booking.name} (ID: ${data.booking.hotel_id})</p>
                    <p><strong>City:</strong> ${data.booking.city}</p>
                    <p><strong>Check-in:</strong> ${data.booking.check_in}</p>
                    <p><strong>Check-out:</strong> ${data.booking.check_out}</p>
                    <p><strong>Rooms:</strong> ${data.booking.num_rooms}</p>
                    <p><strong>Price per Night:</strong> $${parseFloat(data.booking.price_per_night).toFixed(2)}</p>
                    <p><strong>Total Price:</strong> $${parseFloat(data.booking.total_price).toFixed(2)}</p>
                    <p><strong>Booking Date:</strong> ${data.booking.created_at}</p>
                    <h5>Guests:</h5>
                    <ul>
            `;
            data.booking.guests.forEach(guest => {
                html += `
                    <li>
                        <strong>${guest.first_name} ${guest.last_name}</strong> (${guest.category})
                        - SSN: ${guest.ssn}, DOB: ${guest.dob}
                    </li>
                `;
            });
            html += `</ul></div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        document.getElementById('hotelBookingResult').innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryPassengersInFlight() {
    const bookingId = document.getElementById('passengerFlightId').value;
    if (!bookingId) {
        alert('Please enter a booking ID');
        return;
    }

    fetch('query-passengers-by-flight.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'booking_id=' + bookingId
    })
    .then(res => res.json())
    .then(data => {
        const resultDiv = document.getElementById('passengersResult');
        if (data.success) {
            let html = `<div style="border: 1px solid #FF9800; padding: 15px; background-color: #fff3e0;"><h5>Passengers in Booking ${bookingId}:</h5><ul>`;
            data.passengers.forEach(p => {
                html += `<li><strong>${p.first_name} ${p.last_name}</strong> (${p.category}) - SSN: ${p.ssn}, DOB: ${p.dob}, Ticket ID: ${p.ticket_id}, Price: $${parseFloat(p.price).toFixed(2)}</li>`;
            });
            html += `</ul></div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        document.getElementById('passengersResult').innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryAllSep2024() {
    const resultDiv = document.getElementById('sep2024Result');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-all-sep-2024.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #9C27B0; padding: 15px; background-color: #f3e5f5;">`;
            
            html += `<h5>Flight Bookings (${data.flights.length}):</h5>`;
            if (data.flights.length > 0) {
                html += `<ul>`;
                data.flights.forEach(f => {
                    html += `<li>Booking #${f.flight_booking_id}: ${f.origin} → ${f.destination} on ${f.departure_date} | Total: $${parseFloat(f.total_price).toFixed(2)}</li>`;
                });
                html += `</ul>`;
            }

            html += `<h5>Hotel Bookings (${data.hotels.length}):</h5>`;
            if (data.hotels.length > 0) {
                html += `<ul>`;
                data.hotels.forEach(h => {
                    html += `<li>Booking #${h.hotel_booking_id}: ${h.name} (${h.city}), ${h.check_in} to ${h.check_out} | Total: $${parseFloat(h.total_price).toFixed(2)}</li>`;
                });
                html += `</ul>`;
            }
            html += `</div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryBookingsBySSN() {
    const ssn = document.getElementById('personSSN').value;
    if (!ssn) {
        alert('Please enter an SSN');
        return;
    }

    const resultDiv = document.getElementById('ssnBookingsResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-bookings-by-ssn.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'ssn=' + ssn
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #4CAF50; padding: 15px; background-color: #f0f8f0;"><h5>Bookings for ${ssn}:</h5><ul>`;
            data.bookings.forEach(b => {
                html += `<li>Booking #${b.flight_booking_id}: ${b.origin} → ${b.destination} on ${b.departure_date} | ${b.first_name} ${b.last_name} (${b.category})</li>`;
            });
            html += `</ul></div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

// ===== ADMIN QUERIES =====

function queryAdminTexasFlights() {
    const resultDiv = document.getElementById('texasFlightsResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-admin-texas-flights.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #d32f2f; padding: 15px; background-color: #ffebee;"><h5>Flights from Texas (SEP-OCT 2024) - ${data.flights.length} bookings:</h5>`;
            if (data.flights.length > 0) {
                html += `<ul>`;
                data.flights.forEach(f => {
                    html += `<li>Booking #${f.flight_booking_id}: ${f.origin} → ${f.destination} on ${f.departure_date} (${f.airline}) | Total: $${parseFloat(f.total_price).toFixed(2)}</li>`;
                });
                html += `</ul>`;
            }
            html += `</div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryAdminTexasHotels() {
    const resultDiv = document.getElementById('texasHotelsResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-admin-texas-hotels.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #1976d2; padding: 15px; background-color: #e3f2fd;"><h5>Hotels in Texas (SEP-OCT 2024) - ${data.hotels.length} bookings:</h5>`;
            if (data.hotels.length > 0) {
                html += `<ul>`;
                data.hotels.forEach(h => {
                    html += `<li>Booking #${h.hotel_booking_id}: ${h.name} (${h.city}), ${h.check_in} to ${h.check_out}, ${h.num_rooms} rooms | Total: $${parseFloat(h.total_price).toFixed(2)}</li>`;
                });
                html += `</ul>`;
            }
            html += `</div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryAdminExpensiveHotels() {
    const resultDiv = document.getElementById('expensiveHotelsResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-admin-expensive-hotels.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #f57c00; padding: 15px; background-color: #ffe0b2;"><h5>Top 10 Most Expensive Hotel Bookings:</h5><ul>`;
            data.hotels.forEach((h, i) => {
                html += `<li>${i+1}. ${h.name} (${h.city}) - ${h.check_in} to ${h.check_out} | $${parseFloat(h.total_price).toFixed(2)}</li>`;
            });
            html += `</ul></div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryAdminInfantFlights() {
    const resultDiv = document.getElementById('infantFlightsResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-admin-infant-flights.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #c2185b; padding: 15px; background-color: #fce4ec;"><h5>Flights with Infant Passengers - ${data.flights.length} bookings:</h5>`;
            if (data.flights.length > 0) {
                html += `<ul>`;
                data.flights.forEach(f => {
                    html += `<li>Booking #${f.flight_booking_id}: ${f.origin} → ${f.destination} on ${f.departure_date} (${f.airline}) | Total: $${parseFloat(f.total_price).toFixed(2)}</li>`;
                });
                html += `</ul>`;
            }
            html += `</div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryAdminInfantChildrenFlights() {
    const resultDiv = document.getElementById('infantChildrenFlightsResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-admin-infant-children-flights.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #7b1fa2; padding: 15px; background-color: #f3e5f5;"><h5>Flights with Infants AND 5+ Children - ${data.flights.length} bookings:</h5>`;
            if (data.flights.length > 0) {
                html += `<ul>`;
                data.flights.forEach(f => {
                    html += `<li>Booking #${f.flight_booking_id}: ${f.origin} → ${f.destination} on ${f.departure_date} | ${f.infant_count} infants, ${f.child_count} children | Total: $${parseFloat(f.total_price).toFixed(2)}</li>`;
                });
                html += `</ul>`;
            }
            html += `</div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryAdminExpensiveFlights() {
    const resultDiv = document.getElementById('expensiveFlightsResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-admin-expensive-flights.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #d32f2f; padding: 15px; background-color: #ffebee;"><h5>Top 10 Most Expensive Flight Bookings:</h5><ul>`;
            data.flights.forEach((f, i) => {
                html += `<li>${i+1}. ${f.origin} → ${f.destination} on ${f.departure_date} (${f.airline}) | $${parseFloat(f.total_price).toFixed(2)}</li>`;
            });
            html += `</ul></div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryAdminTexasNoInfant() {
    const resultDiv = document.getElementById('texasNoInfantResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-admin-texas-no-infant.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #1b5e20; padding: 15px; background-color: #e8f5e9;"><h5>Texas Flights with NO Infants - ${data.flights.length} bookings:</h5>`;
            if (data.flights.length > 0) {
                html += `<ul>`;
                data.flights.forEach(f => {
                    html += `<li>Booking #${f.flight_booking_id}: ${f.origin} → ${f.destination} on ${f.departure_date} (${f.airline}) | Total: $${parseFloat(f.total_price).toFixed(2)}</li>`;
                });
                html += `</ul>`;
            }
            html += `</div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}

function queryAdminCaliforniaArrivals() {
    const resultDiv = document.getElementById('californiaArrivalsResult');
    resultDiv.innerHTML = '<p>Loading...</p>';

    fetch('query-admin-california-arrivals.php', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            let html = `<div style="border: 1px solid #0277bd; padding: 15px; background-color: #e0f2f1;"><h5>Flights Arriving in California (SEP-OCT 2024):</h5>`;
            
            html += `<h6>Summary:</h6><ul>`;
            data.summary.forEach(s => {
                html += `<li><strong>${s.destination}:</strong> ${s.count} bookings (Month: ${s.arrival_month})</li>`;
            });
            html += `</ul>`;

            html += `<h6>Details:</h6><ul>`;
            data.flights.forEach(f => {
                html += `<li>Booking #${f.flight_booking_id}: ${f.origin} → ${f.destination} arriving ${f.arrival_date}</li>`;
            });
            html += `</ul></div>`;
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    });
}
