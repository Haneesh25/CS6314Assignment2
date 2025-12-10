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
    const flightCart = JSON.parse(localStorage.getItem('flightCart'));
    const hotelCart = JSON.parse(localStorage.getItem('hotelCart'));
    const carCart = JSON.parse(localStorage.getItem('carCart'));
    const cruiseCart = JSON.parse(localStorage.getItem('cruiseCart'));

    let totalAmount = 0;
    let hasItems = false;

    if (flightCart && (flightCart.departingFlight || flightCart.returningFlight)) {
        displayFlightCart(flightCart);

        if (flightCart.departingFlight) {
            const flight = flightCart.departingFlight;
            const flightTotal = calculateFlightPrice(flight);
            totalAmount += flightTotal;
        }

        if (flightCart.returningFlight) {
            const flight = flightCart.returningFlight;
            const flightTotal = calculateFlightPrice(flight);
            totalAmount += flightTotal;
        }

        hasItems = true;
    }

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
    
    generateGuestForm(hotelCart);
}

function generateGuestForm(hotelCart) {
    let formHTML = '<h4>Guest Information</h4>';
    let guestCount = 1;

    for (let i = 0; i < hotelCart.adultGuests; i++) {
        formHTML += createGuestFields(guestCount++, 'Adult');
    }

    for (let i = 0; i < hotelCart.childGuests; i++) {
        formHTML += createGuestFields(guestCount++, 'Child');
    }

    for (let i = 0; i < hotelCart.infantGuests; i++) {
        formHTML += createGuestFields(guestCount++, 'Infant');
    }

    $('#hotelGuestForm').html(formHTML);
    $('#hotelGuestFormSection').show();
}

function createGuestFields(number, type) {
    return `
        <div class="guest-section" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px;">
            <h5>Guest ${number} (${type})</h5>
            <div class="form-group">
                <label>First Name *</label>
                <input type="text" class="guest-first-name" required>
            </div>
            <div class="form-group">
                <label>Last Name *</label>
                <input type="text" class="guest-last-name" required>
            </div>
            <div class="form-group">
                <label>Date of Birth *</label>
                <input type="date" class="guest-dob" required>
            </div>
            <div class="form-group">
                <label>SSN *</label>
                <input type="text" class="guest-ssn" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" placeholder="123-45-6789" required>
            </div>
        </div>
    `;
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
    const flightCart = JSON.parse(localStorage.getItem('flightCart'));
    const passengers = [];

    $('.passenger-section').each(function(index) {
        const typeText = $(this).find('h5').text();
        const category = typeText.includes('Adult') ? 'adult' :
            typeText.includes('Child') ? 'child' : 'infant';

        const flight = flightCart.departingFlight || flightCart.returningFlight;
        let price = flight.price;
        if (category === 'child') price = flight.price * 0.7;
        if (category === 'infant') price = flight.price * 0.1;

        passengers.push({
            ticketId: generateUniqueId('TICKET'),
            firstName: $(this).find('.passenger-first-name').val(),
            lastName: $(this).find('.passenger-last-name').val(),
            dob: $(this).find('.passenger-dob').val(),
            ssn: $(this).find('.passenger-ssn').val(),
            category: category,
            price: price
        });
    });

    const departingBookingId = generateUniqueId('FLIGHT');
    const returningBookingId = flightCart.returningFlight ? generateUniqueId('FLIGHT') : null;

    let totalPrice = 0;
    passengers.forEach(p => totalPrice += parseFloat(p.price));

    const departingBookingData = {
        flightBookingId: departingBookingId,
        flightId: flightCart.departingFlight.flightId,
        totalPrice: totalPrice,
        passengers: passengers
    };

    $.ajax({
        url: 'book-flight.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(departingBookingData),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                if (flightCart.returningFlight) {
                    const returnBookingData = {
                        flightBookingId: returningBookingId,
                        flightId: flightCart.returningFlight.flightId,
                        totalPrice: totalPrice,
                        passengers: passengers
                    };

                    $.ajax({
                        url: 'book-flight.php',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(returnBookingData),
                        dataType: 'json',
                        success: function(returnResponse) {
                            if (returnResponse.success) {
                                localStorage.removeItem('flightCart');
                                showFlightBookingConfirmation(
                                    flightCart, 
                                    passengers, 
                                    departingBookingId, 
                                    returningBookingId
                                );
                            } else {
                                alert('Error booking return flight: ' + returnResponse.message);
                            }
                        },
                        error: function() {
                            alert('Error connecting to server for return flight');
                        }
                    });
                } else {
                    localStorage.removeItem('flightCart');
                    showFlightBookingConfirmation(
                        flightCart, 
                        passengers, 
                        departingBookingId, 
                        null
                    );
                }
            } else {
                alert('Booking failed: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('Error connecting to server. Please try again.');
        }
    });
}

function bookHotel() {
    const hotelCart = JSON.parse(localStorage.getItem('hotelCart'));
    const hotelBookingId = generateUniqueId('HOTEL');

    const guests = [];
    
    $('.guest-section').each(function(index) {
        const typeText = $(this).find('h5').text();
        const category = typeText.includes('Adult') ? 'adult' :
            typeText.includes('Child') ? 'child' : 'infant';

        guests.push({
            ssn: $(this).find('.guest-ssn').val(),
            firstName: $(this).find('.guest-first-name').val(),
            lastName: $(this).find('.guest-last-name').val(),
            dob: $(this).find('.guest-dob').val(),
            category: category
        });
    });

    let allFieldsFilled = true;
    guests.forEach(guest => {
        if (!guest.firstName || !guest.lastName || !guest.dob || !guest.ssn) {
            allFieldsFilled = false;
        }
    });

    if (!allFieldsFilled) {
        alert('Please fill in all guest information fields');
        return;
    }

    const bookingData = {
        hotelBookingId: hotelBookingId,
        hotelId: hotelCart.hotel.hotelId,
        checkInDate: hotelCart.checkInDate,
        checkOutDate: hotelCart.checkOutDate,
        numberOfRooms: hotelCart.roomsNeeded,
        pricePerNight: hotelCart.hotel.pricePerNight,
        totalPrice: hotelCart.totalPrice,
        guests: guests
    };

    $.ajax({
        url: 'book-hotel.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bookingData),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                localStorage.removeItem('hotelCart');
                showHotelBookingConfirmation(hotelCart, guests, hotelBookingId);
            } else {
                alert('Booking failed: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('Error connecting to server. Please try again.');
        }
    });
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

function showFlightBookingConfirmation(flightCart, passengers, departingBookingId, returningBookingId) {
    let confirmationHTML = '<h2>Booking Successful!</h2>';
    
    if (flightCart.departingFlight) {
        const flight = flightCart.departingFlight;
        const totalPrice = calculateFlightPrice(flight);
        
        confirmationHTML += '<h3>✈️ DEPARTING FLIGHT</h3>';
        confirmationHTML += '<p><strong>Flight Booking ID:</strong> ' + departingBookingId + '</p>';
        confirmationHTML += '<p><strong>Flight ID:</strong> ' + flight.flightId + '</p>';
        confirmationHTML += '<p><strong>Route:</strong> ' + flight.origin + ' → ' + flight.destination + '</p>';
        confirmationHTML += '<p><strong>Departure Date:</strong> ' + flight.departureDate + ' at ' + flight.departureTime + '</p>';
        confirmationHTML += '<p><strong>Arrival Date:</strong> ' + flight.departureDate + ' at ' + flight.arrivalTime + '</p>';
        confirmationHTML += '<p><strong>Total Price:</strong> $' + totalPrice.toFixed(2) + '</p>';
        
        confirmationHTML += '<h4>Passenger Tickets</h4>';
        passengers.forEach((passenger, index) => {
            confirmationHTML += '<div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">';
            confirmationHTML += '<p><strong>Ticket ' + (index + 1) + '</strong></p>';
            confirmationHTML += '<p><strong>Ticket ID:</strong> ' + passenger.ticketId + '</p>';
            confirmationHTML += '<p><strong>Name:</strong> ' + passenger.firstName + ' ' + passenger.lastName + '</p>';
            confirmationHTML += '<p><strong>SSN:</strong> ' + passenger.ssn + '</p>';
            confirmationHTML += '<p><strong>Date of Birth:</strong> ' + passenger.dob + '</p>';
            confirmationHTML += '<p><strong>Category:</strong> ' + passenger.category.charAt(0).toUpperCase() + passenger.category.slice(1) + '</p>';
            confirmationHTML += '<p><strong>Price:</strong> $' + parseFloat(passenger.price).toFixed(2) + '</p>';
            confirmationHTML += '</div>';
        });
    }
    
    if (flightCart.returningFlight && returningBookingId) {
        const flight = flightCart.returningFlight;
        const totalPrice = calculateFlightPrice(flight);
        
        confirmationHTML += '<h3>✈️ RETURNING FLIGHT</h3>';
        confirmationHTML += '<p><strong>Flight Booking ID:</strong> ' + returningBookingId + '</p>';
        confirmationHTML += '<p><strong>Flight ID:</strong> ' + flight.flightId + '</p>';
        confirmationHTML += '<p><strong>Route:</strong> ' + flight.origin + ' → ' + flight.destination + '</p>';
        confirmationHTML += '<p><strong>Departure Date:</strong> ' + flight.departureDate + ' at ' + flight.departureTime + '</p>';
        confirmationHTML += '<p><strong>Arrival Date:</strong> ' + flight.departureDate + ' at ' + flight.arrivalTime + '</p>';
        confirmationHTML += '<p><strong>Total Price:</strong> $' + totalPrice.toFixed(2) + '</p>';
        
        confirmationHTML += '<h4>Passenger Tickets</h4>';
        passengers.forEach((passenger, index) => {
            confirmationHTML += '<div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">';
            confirmationHTML += '<p><strong>Ticket ' + (index + 1) + '</strong></p>';
            confirmationHTML += '<p><strong>Ticket ID:</strong> ' + passenger.ticketId + '</p>';
            confirmationHTML += '<p><strong>Name:</strong> ' + passenger.firstName + ' ' + passenger.lastName + '</p>';
            confirmationHTML += '<p><strong>SSN:</strong> ' + passenger.ssn + '</p>';
            confirmationHTML += '<p><strong>Date of Birth:</strong> ' + passenger.dob + '</p>';
            confirmationHTML += '<p><strong>Category:</strong> ' + passenger.category.charAt(0).toUpperCase() + passenger.category.slice(1) + '</p>';
            confirmationHTML += '<p><strong>Price:</strong> $' + parseFloat(passenger.price).toFixed(2) + '</p>';
            confirmationHTML += '</div>';
        });
    }
    
    confirmationHTML += '<a href="index.html" class="btn">Return to Home</a>';

    $('#confirmationDetails').html(confirmationHTML);
    $('#bookingConfirmation').show();
    $('#flightCartSection, #hotelCartSection, #carCartSection, #cruiseCartSection, #cartTotal').hide();
}

function showHotelBookingConfirmation(hotelCart, guests, hotelBookingId) {
    let confirmationHTML = '<h2>Hotel Booking Successful!</h2>';
    
    confirmationHTML += '<h3>🏨 HOTEL BOOKING</h3>';
    confirmationHTML += '<p><strong>Hotel Booking ID:</strong> ' + hotelBookingId + '</p>';
    confirmationHTML += '<p><strong>Hotel ID:</strong> ' + hotelCart.hotel.hotelId + '</p>';
    confirmationHTML += '<p><strong>Hotel Name:</strong> ' + hotelCart.hotel.hotelName + '</p>';
    confirmationHTML += '<p><strong>City:</strong> ' + hotelCart.hotel.city + '</p>';
    confirmationHTML += '<p><strong>Check-in Date:</strong> ' + hotelCart.checkInDate + '</p>';
    confirmationHTML += '<p><strong>Check-out Date:</strong> ' + hotelCart.checkOutDate + '</p>';
    confirmationHTML += '<p><strong>Number of Rooms:</strong> ' + hotelCart.roomsNeeded + '</p>';
    confirmationHTML += '<p><strong>Price per Night:</strong> $' + hotelCart.hotel.pricePerNight.toFixed(2) + '</p>';
    confirmationHTML += '<p><strong>Number of Nights:</strong> ' + hotelCart.nights + '</p>';
    confirmationHTML += '<p><strong>Total Price:</strong> $' + hotelCart.totalPrice.toFixed(2) + '</p>';
    
    confirmationHTML += '<h4>Guest Information</h4>';
    guests.forEach((guest, index) => {
        confirmationHTML += '<div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">';
        confirmationHTML += '<p><strong>Guest ' + (index + 1) + '</strong></p>';
        confirmationHTML += '<p><strong>Name:</strong> ' + guest.firstName + ' ' + guest.lastName + '</p>';
        confirmationHTML += '<p><strong>SSN:</strong> ' + guest.ssn + '</p>';
        confirmationHTML += '<p><strong>Date of Birth:</strong> ' + guest.dob + '</p>';
        confirmationHTML += '<p><strong>Category:</strong> ' + guest.category.charAt(0).toUpperCase() + guest.category.slice(1) + '</p>';
        confirmationHTML += '</div>';
    });
    
    confirmationHTML += '<a href="index.html" class="btn">Return to Home</a>';

    $('#confirmationDetails').html(confirmationHTML);
    $('#bookingConfirmation').show();
    $('#flightCartSection, #hotelCartSection, #carCartSection, #cruiseCartSection, #cartTotal').hide();
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
