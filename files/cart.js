$(document).ready(function() {
    loadCart();

    $('#flightBookingForm').on('submit', function(e) {
        e.preventDefault();
        bookFlight();
    });


    $('#bookHotelBtn').on('click', function() {
        bookHotel();
    });


    $('#bookCarBtn').on('click', function() {
        bookCar();
    });


    $('#bookCruiseBtn').on('click', function() {
        bookCruise();
    });
});

function loadCart() {
    let totalAmount = 0;
    let hasItems = false;

    // --- Flight cart loaded from server ---
    $.ajax({
        url: 'cart.php', // server returns JSON with cart info
        method: 'GET',
        dataType: 'json',
        success: function(flightCart) {
            if (flightCart && (flightCart.departingFlight || flightCart.returningFlight)) {
                displayFlightCart(flightCart);

                if (flightCart.departingFlight) {
                    const flight = flightCart.departingFlight;
                    totalAmount += calculateFlightPrice(flight);
                }

                if (flightCart.returningFlight) {
                    const flight = flightCart.returningFlight;
                    totalAmount += calculateFlightPrice(flight);
                }

                hasItems = true;
            }

            // --- Hotel, Car, Cruise still from localStorage ---
            const hotelCart = JSON.parse(localStorage.getItem('hotelCart'));
            const carCart = JSON.parse(localStorage.getItem('carCart'));
            const cruiseCart = JSON.parse(localStorage.getItem('cruiseCart'));

            if (hotelCart) {
                displayHotelCart(hotelCart);
                totalAmount += hotelCart.totalPrice;
                hasItems = true;
            }

            if (carCart) {
                displayCarCart(carCart);
                totalAmount += carCart.totalPrice;
                hasItems = true;
            }

            if (cruiseCart) {
                displayCruiseCart(cruiseCart);
                totalAmount += cruiseCart.totalPrice;
                hasItems = true;
            }

            // --- Show totals or empty cart ---
            if (hasItems) {
                $('#totalAmount').text(totalAmount.toFixed(2));
                $('#cartTotal').show();
            } else {
                $('#emptyCart').show();
            }
        },
        error: function() {
            // fallback if server fails: still load hotel/car/cruise
            const hotelCart = JSON.parse(localStorage.getItem('hotelCart'));
            const carCart = JSON.parse(localStorage.getItem('carCart'));
            const cruiseCart = JSON.parse(localStorage.getItem('cruiseCart'));

            if (hotelCart) {
                displayHotelCart(hotelCart);
                totalAmount += hotelCart.totalPrice;
                hasItems = true;
            }

            if (carCart) {
                displayCarCart(carCart);
                totalAmount += carCart.totalPrice;
                hasItems = true;
            }

            if (cruiseCart) {
                displayCruiseCart(cruiseCart);
                totalAmount += cruiseCart.totalPrice;
                hasItems = true;
            }

            if (hasItems) {
                $('#totalAmount').text(totalAmount.toFixed(2));
                $('#cartTotal').show();
            } else {
                $('#emptyCart').show();
            }
        }
    });
}

function displayFlightCart(flightCart) {
    let cartHTML = '';

    if (flightCart.departingFlight) {
        const flight = flightCart.departingFlight;
        const flightTotal = calculateFlightPrice(flight);

        cartHTML += `
            <div class="cart-item">
                <h4>Departing Flight</h4>
                <p><strong>Flight ID:</strong> ${flight.flightId}</p>
                <p><strong>Route:</strong> ${flight.origin} → ${flight.destination}</p>
                <p><strong>Date:</strong> ${flight.departureDate}</p>
                <p><strong>Time:</strong> ${flight.departureTime} - ${flight.arrivalTime}</p>
                <p><strong>Passengers:</strong> ${flight.adults} Adult(s), ${flight.children} Child(ren), ${flight.infants} Infant(s)</p>
                <p><strong>Price Breakdown:</strong></p>
                <ul>
                    <li>Adults: ${flight.adults} × $${flight.price} = $${(flight.adults * flight.price).toFixed(2)}</li>
                    <li>Children: ${flight.children} × $${(flight.price * 0.7).toFixed(2)} = $${(flight.children * flight.price * 0.7).toFixed(2)}</li>
                    <li>Infants: ${flight.infants} × $${(flight.price * 0.1).toFixed(2)} = $${(flight.infants * flight.price * 0.1).toFixed(2)}</li>
                </ul>
                <p><strong>Subtotal:</strong> $${flightTotal.toFixed(2)}</p>
            </div>
        `;
    }

    if (flightCart.returningFlight) {
        const flight = flightCart.returningFlight;
        const flightTotal = calculateFlightPrice(flight);

        cartHTML += `
            <div class="cart-item">
                <h4>Returning Flight</h4>
                <p><strong>Flight ID:</strong> ${flight.flightId}</p>
                <p><strong>Route:</strong> ${flight.origin} → ${flight.destination}</p>
                <p><strong>Date:</strong> ${flight.departureDate}</p>
                <p><strong>Time:</strong> ${flight.departureTime} - ${flight.arrivalTime}</p>
                <p><strong>Passengers:</strong> ${flight.adults} Adult(s), ${flight.children} Child(ren), ${flight.infants} Infant(s)</p>
                <p><strong>Price Breakdown:</strong></p>
                <ul>
                    <li>Adults: ${flight.adults} × $${flight.price} = $${(flight.adults * flight.price).toFixed(2)}</li>
                    <li>Children: ${flight.children} × $${(flight.price * 0.7).toFixed(2)} = $${(flight.children * flight.price * 0.7).toFixed(2)}</li>
                    <li>Infants: ${flight.infants} × $${(flight.price * 0.1).toFixed(2)} = $${(flight.infants * flight.price * 0.1).toFixed(2)}</li>
                </ul>
                <p><strong>Subtotal:</strong> $${flightTotal.toFixed(2)}</p>
            </div>
        `;
    }

    $('#flightCartContent').html(cartHTML);
    $('#flightCartSection').show();


    generatePassengerForm(flightCart);
}

function generatePassengerForm(flightCart) {
    const flight = flightCart.departingFlight || flightCart.returningFlight;
    const totalPassengers = flight.adults + flight.children + flight.infants;

    let formHTML = '';
    let passengerCount = 1;


    for (let i = 0; i < flight.adults; i++) {
        formHTML += createPassengerFields(passengerCount++, 'Adult');
    }


    for (let i = 0; i < flight.children; i++) {
        formHTML += createPassengerFields(passengerCount++, 'Child');
    }


    for (let i = 0; i < flight.infants; i++) {
        formHTML += createPassengerFields(passengerCount++, 'Infant');
    }

    $('#passengerFields').html(formHTML);
    $('#flightPassengerForm').show();
}

function createPassengerFields(number, type) {
    return `
        <div class="passenger-section" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px;">
            <h5>Passenger ${number} (${type})</h5>
            <div class="form-group">
                <label>First Name *</label>
                <input type="text" class="passenger-first-name" required>
            </div>
            <div class="form-group">
                <label>Last Name *</label>
                <input type="text" class="passenger-last-name" required>
            </div>
            <div class="form-group">
                <label>Date of Birth *</label>
                <input type="date" class="passenger-dob" required>
            </div>
            <div class="form-group">
                <label>SSN *</label>
                <input type="text" class="passenger-ssn" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" placeholder="123-45-6789" required>
            </div>
        </div>
    `;
}

function calculateFlightPrice(flight) {
    const adultPrice = flight.adults * flight.price;
    const childPrice = flight.children * flight.price * 0.7;
    const infantPrice = flight.infants * flight.price * 0.1;
    return adultPrice + childPrice + infantPrice;
}

function displayHotelCart(hotelCart) {
    const cartHTML = `
        <div class="cart-item">
            <p><strong>Hotel:</strong> ${hotelCart.hotel.hotelName}</p>
            <p><strong>Hotel ID:</strong> ${hotelCart.hotel.hotelId}</p>
            <p><strong>City:</strong> ${hotelCart.hotel.city}</p>
            <p><strong>Check-in:</strong> ${hotelCart.checkInDate}</p>
            <p><strong>Check-out:</strong> ${hotelCart.checkOutDate}</p>
            <p><strong>Nights:</strong> ${hotelCart.nights}</p>
            <p><strong>Rooms:</strong> ${hotelCart.roomsNeeded}</p>
            <p><strong>Guests:</strong> ${hotelCart.adultGuests} Adult(s), ${hotelCart.childGuests} Child(ren), ${hotelCart.infantGuests} Infant(s)</p>
            <p><strong>Price per Night:</strong> $${hotelCart.hotel.pricePerNight}</p>
            <p><strong>Total Price:</strong> $${hotelCart.totalPrice.toFixed(2)}</p>
        </div>
    `;

    $('#hotelCartContent').html(cartHTML);
    $('#hotelCartSection').show();
}

function displayCarCart(carCart) {
    const cartHTML = `
        <div class="cart-item">
            <p><strong>Car Type:</strong> ${carCart.car.carType}</p>
            <p><strong>Car ID:</strong> ${carCart.car.carId}</p>
            <p><strong>City:</strong> ${carCart.car.city}</p>
            <p><strong>Pick-up Date:</strong> ${carCart.checkInDate}</p>
            <p><strong>Drop-off Date:</strong> ${carCart.checkOutDate}</p>
            <p><strong>Days:</strong> ${carCart.days}</p>
            <p><strong>Price per Day:</strong> $${carCart.car.pricePerDay}</p>
            <p><strong>Total Price:</strong> $${carCart.totalPrice.toFixed(2)}</p>
        </div>
    `;

    $('#carCartContent').html(cartHTML);
    $('#carCartSection').show();
}

function displayCruiseCart(cruiseCart) {
    const cartHTML = `
        <div class="cart-item">
            <p><strong>Cruise Line:</strong> ${cruiseCart.line}</p>
            <p><strong>Cruise ID:</strong> ${cruiseCart.cruiseId}</p>
            <p><strong>Destination:</strong> ${cruiseCart.destination}</p>
            <p><strong>Duration:</strong> ${cruiseCart.duration} days</p>
            <p><strong>Departure Date:</strong> ${cruiseCart.departureDate}</p>
            <p><strong>Rooms:</strong> ${cruiseCart.roomsNeeded}</p>
            <p><strong>Guests:</strong> ${cruiseCart.adults} Adult(s), ${cruiseCart.children} Child(ren), ${cruiseCart.infants} Infant(s)</p>
            <p><strong>Price per Person:</strong> $${cruiseCart.pricePerPerson}</p>
            <p><strong>Total Price:</strong> $${cruiseCart.totalPrice.toFixed(2)}</p>
        </div>
    `;

    $('#cruiseCartContent').html(cartHTML);
    $('#cruiseCartSection').show();
}

function bookFlight() {
    // Validate passenger fields
    let isValid = true;
    $('.passenger-section').each(function() {
        const firstName = $(this).find('.passenger-first-name').val().trim();
        const lastName = $(this).find('.passenger-last-name').val().trim();
        const dob = $(this).find('.passenger-dob').val();
        const ssn = $(this).find('.passenger-ssn').val().trim();

        if (!firstName || !lastName || !dob || !ssn) {
            isValid = false;
            alert('Please fill in all passenger information');
            return false;
        }
    });

    if (!isValid) return;

    // Collect passenger data organized by flight type
    const passengersData = {
        departing: [],
        returning: []
    };

    const flightCart = JSON.parse(sessionStorage.getItem('flightCart') || '{}');
    
    // Count how many passengers for each flight type
    if (flightCart.departingFlight) {
        const totalPassengers = flightCart.departingFlight.adults + flightCart.departingFlight.children + flightCart.departingFlight.infants;
        for (let i = 0; i < totalPassengers; i++) {
            passengersData.departing.push({
                firstName: $($('.passenger-section')[i]).find('.passenger-first-name').val(),
                lastName: $($('.passenger-section')[i]).find('.passenger-last-name').val(),
                dob: $($('.passenger-section')[i]).find('.passenger-dob').val(),
                ssn: $($('.passenger-section')[i]).find('.passenger-ssn').val()
            });
        }
    }

    if (flightCart.returningFlight) {
        const totalPassengers = flightCart.returningFlight.adults + flightCart.returningFlight.children + flightCart.returningFlight.infants;
        const departingCount = flightCart.departingFlight ? flightCart.departingFlight.adults + flightCart.departingFlight.children + flightCart.departingFlight.infants : 0;
        
        for (let i = 0; i < totalPassengers; i++) {
            passengersData.returning.push({
                firstName: $($('.passenger-section')[departingCount + i]).find('.passenger-first-name').val(),
                lastName: $($('.passenger-section')[departingCount + i]).find('.passenger-last-name').val(),
                dob: $($('.passenger-section')[departingCount + i]).find('.passenger-dob').val(),
                ssn: $($('.passenger-section')[departingCount + i]).find('.passenger-ssn').val()
            });
        }
    }

    $.ajax({
        url: 'flight-book.php',
        method: 'POST',
        data: { passengers: passengersData },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                displayBookingConfirmation(response.bookings);
                $('#flightPassengerForm, #flightCartSection, #cartTotal').hide();
            } else {
                alert('Booking failed: ' + response.message);
            }
        },
        error: function(err) {
            console.error(err);
            alert('Error booking flight. Please try again.');
        }
    });
}

function displayBookingConfirmation(bookings) {
    let confirmationHTML = '<h3>Booking Confirmation</h3>';

    bookings.forEach(booking => {
        confirmationHTML += `
            <div style="border: 2px solid #4CAF50; padding: 20px; margin: 15px 0; border-radius: 5px; background-color: #f0f8f0;">
                <h4 style="color: #2c5f2d; text-transform: uppercase; margin-bottom: 15px;">
                    ${booking.flight_type === 'departing' ? '✈ Departing Flight' : '✈ Returning Flight'}
                </h4>

                <!-- FLIGHT BOOKING DETAILS -->
                <div style="background-color: #e8f5e9; padding: 15px; border-radius: 3px; margin-bottom: 15px;">
                    <p><strong>Flight Booking ID:</strong> ${booking.flight_booking_id}</p>
                    <p><strong>Flight ID:</strong> ${booking.flight_id}</p>
                    <p><strong>Route:</strong> ${booking.origin} → ${booking.destination}</p>
                    <p><strong>Departure Date:</strong> ${booking.departure_date} at ${booking.departure_time}</p>
                    <p><strong>Arrival Date:</strong> ${booking.arrival_date} at ${booking.arrival_time}</p>
                    <p><strong style="color: #d32f2f; font-size: 16px;">Total Price: $${parseFloat(booking.total_price).toFixed(2)}</strong></p>
                </div>

                <!-- TICKET DETAILS -->
                <div style="margin-top: 15px;">
                    <h5 style="color: #1976d2; margin-bottom: 10px;">Passenger Tickets</h5>
        `;

        booking.tickets.forEach((ticket, index) => {
            confirmationHTML += `
                <div style="background-color: #e3f2fd; padding: 12px; border-left: 4px solid #1976d2; margin-bottom: 10px; border-radius: 2px;">
                    <p><strong>Ticket ${index + 1}</strong></p>
                    <p style="margin: 5px 0;"><strong>Ticket ID:</strong> ${ticket.ticket_id}</p>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${ticket.first_name} ${ticket.last_name}</p>
                    <p style="margin: 5px 0;"><strong>SSN:</strong> ${ticket.ssn}</p>
                    <p style="margin: 5px 0;"><strong>Date of Birth:</strong> ${ticket.dob}</p>
                    <p style="margin: 5px 0;"><strong>Category:</strong> <span style="text-transform: capitalize; font-weight: bold; color: #d32f2f;">${ticket.category}</span></p>
                    <p style="margin: 5px 0;"><strong>Price:</strong> $${parseFloat(ticket.price).toFixed(2)}</p>
                </div>
            `;
        });

        confirmationHTML += `
                </div>
            </div>
        `;
    });

    confirmationHTML += `
        <div style="margin-top: 20px; text-align: center;">
            <a href="index.html" class="btn" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; display: inline-block;">Return to Home</a>
        </div>
    `;

    $('#confirmationDetails').html(confirmationHTML);
    $('#bookingConfirmation').show();
}

function bookHotel() {
    const hotelCart = JSON.parse(localStorage.getItem('hotelCart'));
    const bookingNumber = generateUniqueId('HOTEL');
    const userId = generateUniqueId('USER');

    const booking = {
        userId: userId,
        bookingNumber: bookingNumber,
        ...hotelCart,
        bookingDate: new Date().toISOString()
    };


    saveToStorage('hotelBookings', booking);


    updateHotelAvailability(hotelCart);


    localStorage.removeItem('hotelCart');


    showBookingConfirmation('Hotel', booking);
}

function bookCar() {
    const carCart = JSON.parse(localStorage.getItem('carCart'));
    const bookingNumber = generateUniqueId('CAR');
    const userId = generateUniqueId('USER');

    const booking = {
        userId: userId,
        bookingNumber: bookingNumber,
        ...carCart,
        bookingDate: new Date().toISOString()
    };


    saveToStorage('carBookings', booking);


    updateCarAvailability(carCart);


    localStorage.removeItem('carCart');


    showBookingConfirmation('Car', booking);
}

function bookCruise() {
    const cruiseCart = JSON.parse(localStorage.getItem('cruiseCart'));
    const bookingNumber = generateUniqueId('CRUISE');
    const userId = generateUniqueId('USER');

    const booking = {
        userId: userId,
        bookingNumber: bookingNumber,
        ...cruiseCart,
        bookingDate: new Date().toISOString()
    };


    saveToStorage('cruiseBookings', booking);


    localStorage.removeItem('cruiseCart');


    showBookingConfirmation('Cruise', booking);
}

function showBookingConfirmation(type, booking) {
    let confirmationHTML = `
        <p><strong>Booking Successful!</strong></p>
        <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
        <p><strong>User ID:</strong> ${booking.userId}</p>
        <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleString()}</p>
        <p>Your ${type.toLowerCase()} booking has been confirmed.</p>
        <a href="index.html" class="btn">Return to Home</a>
    `;

    $('#confirmationDetails').html(confirmationHTML);
    $('#bookingConfirmation').show();


    $('#flightCartSection, #hotelCartSection, #carCartSection, #cruiseCartSection, #cartTotal').hide();
}

function updateFlightAvailability(flightCart) {


    const flights = JSON.parse(localStorage.getItem('availableFlights')) || [];

    if (flightCart.departingFlight) {
        const index = flights.findIndex(f => f.flightId === flightCart.departingFlight.flightId);
        if (index !== -1) {
            const totalPassengers = flightCart.departingFlight.adults + flightCart.departingFlight.children + flightCart.departingFlight.infants;
            flights[index].availableSeats -= totalPassengers;
        }
    }

    if (flightCart.returningFlight) {
        const index = flights.findIndex(f => f.flightId === flightCart.returningFlight.flightId);
        if (index !== -1) {
            const totalPassengers = flightCart.returningFlight.adults + flightCart.returningFlight.children + flightCart.returningFlight.infants;
            flights[index].availableSeats -= totalPassengers;
        }
    }

    localStorage.setItem('availableFlights', JSON.stringify(flights));
}

function updateHotelAvailability(hotelCart) {


    console.log('Hotel availability updated for', hotelCart.hotel.hotelId);
}

function updateCarAvailability(carCart) {


    console.log('Car availability updated for', carCart.car.carId);
}