$(document).ready(function() {
    checkLogin();
    
    // Event listeners
    $('#bookingByIdForm').on('submit', function(e) {
        e.preventDefault();
        getBookingById();
    });

    $('#passengersByBookingForm').on('submit', function(e) {
        e.preventDefault();
        getPassengersByBooking();
    });

    $('#septemberBookingsBtn').on('click', getSeptemberBookings);
    $('#bookingsBySSNForm').on('submit', function(e) {
        e.preventDefault();
        getBookingsBySSN();
    });

    // Admin event listeners
    $('#loadFlightsBtn').on('click', loadFlights);
    $('#loadHotelsBtn').on('click', loadHotels);
    $('#texasDeparturesBtn').on('click', getTexasDepartures);
    $('#texasHotelsBtn').on('click', getTexasHotels);
    $('#expensiveHotelsBtn').on('click', getExpensiveHotels);
    $('#infantFlightsBtn').on('click', getInfantFlights);
    $('#infantChildrenFlightsBtn').on('click', getInfantChildrenFlights);
    $('#expensiveFlightsBtn').on('click', getExpensiveFlights);
    $('#texasNoInfantsBtn').on('click', getTexasNoInfants);
    $('#californiaArrivalsBtn').on('click', getCaliforniaArrivals);

    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        logout();
    });
});

function checkLogin() {
    $.ajax({
        url: 'check-session.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.loggedIn) {
                $('#accountContent').show();
                $('#loginRequired').hide();
                $('#userWelcome').text('Welcome, ' + response.firstName + ' ' + response.lastName);
                
                // Show appropriate queries based on user type
                if (response.phone === '222-222-2222') {
                    // Admin
                    $('#adminQueries').show();
                    $('#userQueries').show(); // Admin can see both
                } else {
                    // Regular user
                    $('#userQueries').show();
                    $('#adminQueries').hide();
                }
            } else {
                $('#accountContent').hide();
                $('#loginRequired').show();
            }
        },
        error: function() {
            $('#accountContent').hide();
            $('#loginRequired').show();
        }
    });
}

function logout() {
    $.ajax({
        url: 'logout.php',
        type: 'POST',
        success: function() {
            window.location.href = 'index.html';
        }
    });
}

// User Query Functions

function getBookingById() {
    const bookingType = $('#bookingType').val();
    const bookingId = $('#bookingId').val().trim();
    
    if (!bookingId) {
        $('#bookingByIdResult').html('<p class="error">Please enter a booking ID</p>');
        return;
    }

    $.ajax({
        url: 'get-booking.php',
        type: 'POST',
        data: { bookingType: bookingType, bookingId: bookingId },
        dataType: 'json',
        success: function(response) {
            displayBookingResult(response, '#bookingByIdResult');
        },
        error: function() {
            $('#bookingByIdResult').html('<p class="error">Error fetching booking</p>');
        }
    });
}

function getPassengersByBooking() {
    const bookingId = $('#passengerBookingId').val().trim();
    
    if (!bookingId) {
        $('#passengersByBookingResult').html('<p class="error">Please enter a booking ID</p>');
        return;
    }

    $.ajax({
        url: 'get-passengers.php',
        type: 'POST',
        data: { bookingId: bookingId },
        dataType: 'json',
        success: function(response) {
            displayPassengers(response, '#passengersByBookingResult');
        },
        error: function() {
            $('#passengersByBookingResult').html('<p class="error">Error fetching passengers</p>');
        }
    });
}

function getSeptemberBookings() {
    $.ajax({
        url: 'get-september-bookings.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            displayMultipleBookings(response, '#septemberBookingsResult');
        },
        error: function() {
            $('#septemberBookingsResult').html('<p class="error">Error fetching bookings</p>');
        }
    });
}

function getBookingsBySSN() {
    const ssn = $('#searchSSN').val().trim();
    
    if (!ssn) {
        $('#bookingsBySSNResult').html('<p class="error">Please enter an SSN</p>');
        return;
    }

    $.ajax({
        url: 'get-bookings-by-ssn.php',
        type: 'POST',
        data: { ssn: ssn },
        dataType: 'json',
        success: function(response) {
            displayMultipleBookings(response, '#bookingsBySSNResult');
        },
        error: function() {
            $('#bookingsBySSNResult').html('<p class="error">Error fetching bookings</p>');
        }
    });
}

// Admin Query Functions

function loadFlights() {
    $('#loadDataResult').html('<p>Loading flights...</p>');
    
    $.ajax({
        url: 'load-flights.php',
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $('#loadDataResult').html('<p class="success">' + response.message + '</p>');
            } else {
                $('#loadDataResult').html('<p class="error">' + response.message + '</p>');
            }
        },
        error: function() {
            $('#loadDataResult').html('<p class="error">Error loading flights</p>');
        }
    });
}

function loadHotels() {
    $('#loadDataResult').html('<p>Loading hotels...</p>');
    
    $.ajax({
        url: 'load-hotels.php',
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $('#loadDataResult').html('<p class="success">' + response.message + '</p>');
            } else {
                $('#loadDataResult').html('<p class="error">' + response.message + '</p>');
            }
        },
        error: function() {
            $('#loadDataResult').html('<p class="error">Error loading hotels</p>');
        }
    });
}

function getTexasDepartures() {
    $.ajax({
        url: 'admin-texas-departures.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            displayFlightBookings(response, '#texasDeparturesResult');
        },
        error: function() {
            $('#texasDeparturesResult').html('<p class="error">Error fetching data</p>');
        }
    });
}

function getTexasHotels() {
    $.ajax({
        url: 'admin-texas-hotels.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            displayHotelBookings(response, '#texasHotelsResult');
        },
        error: function() {
            $('#texasHotelsResult').html('<p class="error">Error fetching data</p>');
        }
    });
}

function getExpensiveHotels() {
    $.ajax({
        url: 'admin-expensive-hotels.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            displayHotelBookings(response, '#expensiveHotelsResult');
        },
        error: function() {
            $('#expensiveHotelsResult').html('<p class="error">Error fetching data</p>');
        }
    });
}

function getInfantFlights() {
    $.ajax({
        url: 'admin-infant-flights.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            displayFlightBookings(response, '#infantFlightsResult');
        },
        error: function() {
            $('#infantFlightsResult').html('<p class="error">Error fetching data</p>');
        }
    });
}

function getInfantChildrenFlights() {
    $.ajax({
        url: 'admin-infant-children-flights.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            displayFlightBookings(response, '#infantChildrenFlightsResult');
        },
        error: function() {
            $('#infantChildrenFlightsResult').html('<p class="error">Error fetching data</p>');
        }
    });
}

function getExpensiveFlights() {
    $.ajax({
        url: 'admin-expensive-flights.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            displayFlightBookings(response, '#expensiveFlightsResult');
        },
        error: function() {
            $('#expensiveFlightsResult').html('<p class="error">Error fetching data</p>');
        }
    });
}

function getTexasNoInfants() {
    $.ajax({
        url: 'admin-texas-no-infants.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            displayFlightBookings(response, '#texasNoInfantsResult');
        },
        error: function() {
            $('#texasNoInfantsResult').html('<p class="error">Error fetching data</p>');
        }
    });
}

function getCaliforniaArrivals() {
    $.ajax({
        url: 'admin-california-arrivals.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $('#californiaArrivalsResult').html(
                    '<p><strong>Total Flights Arriving in California (Sep-Oct 2024):</strong> ' + 
                    response.count + '</p>'
                );
            } else {
                $('#californiaArrivalsResult').html('<p class="error">Error fetching count</p>');
            }
        },
        error: function() {
            $('#californiaArrivalsResult').html('<p class="error">Error fetching data</p>');
        }
    });
}

// Display Helper Functions

function displayBookingResult(response, targetDiv) {
    if (!response.success) {
        $(targetDiv).html('<p class="error">' + response.message + '</p>');
        return;
    }

    let html = '<div class="booking-details">';
    
    if (response.type === 'flight') {
        html += '<h4>Flight Booking Details</h4>';
        html += '<p><strong>Booking ID:</strong> ' + response.data.flightBookingId + '</p>';
        html += '<p><strong>Flight ID:</strong> ' + response.data.flightId + '</p>';
        html += '<p><strong>Origin:</strong> ' + response.data.origin + '</p>';
        html += '<p><strong>Destination:</strong> ' + response.data.destination + '</p>';
        html += '<p><strong>Departure:</strong> ' + response.data.departureDate + ' at ' + response.data.departureTime + '</p>';
        html += '<p><strong>Total Price:</strong> $' + parseFloat(response.data.totalPrice).toFixed(2) + '</p>';
    } else {
        html += '<h4>Hotel Booking Details</h4>';
        html += '<p><strong>Booking ID:</strong> ' + response.data.hotelBookingId + '</p>';
        html += '<p><strong>Hotel:</strong> ' + response.data.hotelName + '</p>';
        html += '<p><strong>City:</strong> ' + response.data.city + '</p>';
        html += '<p><strong>Check-in:</strong> ' + response.data.checkInDate + '</p>';
        html += '<p><strong>Check-out:</strong> ' + response.data.checkOutDate + '</p>';
        html += '<p><strong>Rooms:</strong> ' + response.data.numberOfRooms + '</p>';
        html += '<p><strong>Total Price:</strong> $' + parseFloat(response.data.totalPrice).toFixed(2) + '</p>';
    }
    
    html += '</div>';
    $(targetDiv).html(html);
}

function displayPassengers(response, targetDiv) {
    if (!response.success) {
        $(targetDiv).html('<p class="error">' + response.message + '</p>');
        return;
    }

    if (response.passengers.length === 0) {
        $(targetDiv).html('<p>No passengers found for this booking.</p>');
        return;
    }

    let html = '<h4>Passengers</h4>';
    response.passengers.forEach(function(passenger) {
        html += '<div class="passenger-item">';
        html += '<p><strong>Name:</strong> ' + passenger.firstName + ' ' + passenger.lastName + '</p>';
        html += '<p><strong>SSN:</strong> ' + passenger.ssn + '</p>';
        html += '<p><strong>Date of Birth:</strong> ' + passenger.dob + '</p>';
        html += '<p><strong>Category:</strong> ' + passenger.category + '</p>';
        html += '<p><strong>Ticket ID:</strong> ' + passenger.ticketId + '</p>';
        html += '<p><strong>Price:</strong> $' + parseFloat(passenger.price).toFixed(2) + '</p>';
        html += '</div><hr>';
    });
    
    $(targetDiv).html(html);
}

function displayMultipleBookings(response, targetDiv) {
    if (!response.success) {
        $(targetDiv).html('<p class="error">' + response.message + '</p>');
        return;
    }

    if (response.bookings.length === 0) {
        $(targetDiv).html('<p>No bookings found.</p>');
        return;
    }

    let html = '<h4>Bookings Found: ' + response.bookings.length + '</h4>';
    
    response.bookings.forEach(function(booking) {
        html += '<div class="booking-item">';
        if (booking.type === 'flight') {
            html += '<p><strong>Type:</strong> Flight</p>';
            html += '<p><strong>Booking ID:</strong> ' + booking.flightBookingId + '</p>';
            html += '<p><strong>Flight ID:</strong> ' + booking.flightId + '</p>';
            html += '<p><strong>Route:</strong> ' + booking.origin + ' → ' + booking.destination + '</p>';
            html += '<p><strong>Date:</strong> ' + booking.departureDate + '</p>';
        } else {
            html += '<p><strong>Type:</strong> Hotel</p>';
            html += '<p><strong>Booking ID:</strong> ' + booking.hotelBookingId + '</p>';
            html += '<p><strong>Hotel:</strong> ' + booking.hotelName + '</p>';
            html += '<p><strong>City:</strong> ' + booking.city + '</p>';
            html += '<p><strong>Dates:</strong> ' + booking.checkInDate + ' to ' + booking.checkOutDate + '</p>';
        }
        html += '<p><strong>Total Price:</strong> $' + parseFloat(booking.totalPrice).toFixed(2) + '</p>';
        html += '</div><hr>';
    });
    
    $(targetDiv).html(html);
}

function displayFlightBookings(response, targetDiv) {
    if (!response.success) {
        $(targetDiv).html('<p class="error">' + response.message + '</p>');
        return;
    }

    if (response.bookings.length === 0) {
        $(targetDiv).html('<p>No flight bookings found.</p>');
        return;
    }

    let html = '<h4>Flight Bookings Found: ' + response.bookings.length + '</h4>';
    
    response.bookings.forEach(function(booking) {
        html += '<div class="booking-item">';
        html += '<p><strong>Booking ID:</strong> ' + booking.flightBookingId + '</p>';
        html += '<p><strong>Flight ID:</strong> ' + booking.flightId + '</p>';
        html += '<p><strong>Route:</strong> ' + booking.origin + ' → ' + booking.destination + '</p>';
        html += '<p><strong>Departure:</strong> ' + booking.departureDate + ' at ' + booking.departureTime + '</p>';
        html += '<p><strong>Total Price:</strong> $' + parseFloat(booking.totalPrice).toFixed(2) + '</p>';
        html += '</div><hr>';
    });
    
    $(targetDiv).html(html);
}

function displayHotelBookings(response, targetDiv) {
    if (!response.success) {
        $(targetDiv).html('<p class="error">' + response.message + '</p>');
        return;
    }

    if (response.bookings.length === 0) {
        $(targetDiv).html('<p>No hotel bookings found.</p>');
        return;
    }

    let html = '<h4>Hotel Bookings Found: ' + response.bookings.length + '</h4>';
    
    response.bookings.forEach(function(booking) {
        html += '<div class="booking-item">';
        html += '<p><strong>Booking ID:</strong> ' + booking.hotelBookingId + '</p>';
        html += '<p><strong>Hotel:</strong> ' + booking.hotelName + '</p>';
        html += '<p><strong>City:</strong> ' + booking.city + '</p>';
        html += '<p><strong>Check-in:</strong> ' + booking.checkInDate + '</p>';
        html += '<p><strong>Check-out:</strong> ' + booking.checkOutDate + '</p>';
        html += '<p><strong>Rooms:</strong> ' + booking.numberOfRooms + '</p>';
        html += '<p><strong>Total Price:</strong> $' + parseFloat(booking.totalPrice).toFixed(2) + '</p>';
        html += '</div><hr>';
    });
    
    $(targetDiv).html(html);
}
