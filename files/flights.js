let availableFlights = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeFlights();

    const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const returnDateGroup = document.getElementById('returnDateGroup');
            if (this.value === 'roundtrip') {
                returnDateGroup.style.display = 'block';
                document.getElementById('returnDate').required = true;
            } else {
                returnDateGroup.style.display = 'none';
                document.getElementById('returnDate').required = false;
            }
        });
    });

    const passengerIcon = document.getElementById('passengerIcon');
    const passengerInfo = document.getElementById('passengerInfo');

    passengerIcon.addEventListener('click', function() {
        if (passengerInfo.style.display === 'none' || !passengerInfo.style.display) {
            passengerInfo.style.display = 'block';
        } else {
            passengerInfo.style.display = 'none';
        }
    });

    const flightSearchForm = document.getElementById('flightSearchForm');
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            searchFlights();
        });
    }
});

function initializeFlights() {
    const flightData = [];
    const airlines = ['American Airlines', 'United Airlines', 'Southwest Airlines', 'Delta Airlines'];
    const texasCities = ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'];
    const californiaCities = ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno'];

    let flightId = 1000;

    for (let month = 9; month <= 12; month++) {
        const daysInMonth = month === 9 ? 30 : (month === 11 ? 30 : 31);
        for (let day = 1; day <= daysInMonth; day++) {
            for (let i = 0; i < 2; i++) {
                const originIndex = Math.floor(Math.random() * texasCities.length);
                const destIndex = Math.floor(Math.random() * californiaCities.length);
                const origin = texasCities[originIndex];
                const destination = californiaCities[destIndex];
                const airline = airlines[Math.floor(Math.random() * airlines.length)];
                const departureHour = Math.floor(Math.random() * 24);
                const arrivalHour = (departureHour + 2) % 24;

                const dateStr = `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                flightData.push({
                    flightId: flightId++,
                    airline: airline,
                    origin: origin,
                    destination: destination,
                    departureDate: dateStr,
                    arrivalDate: dateStr,
                    departureTime: `${String(departureHour).padStart(2, '0')}:00:00`,
                    arrivalTime: `${String(arrivalHour).padStart(2, '0')}:30:00`,
                    availableSeats: Math.floor(Math.random() * 100) + 10,
                    price: Math.floor(Math.random() * 200) + 150
                });
            }
        }
    }

    localStorage.setItem('availableFlights', JSON.stringify(flightData));
    availableFlights = flightData;
}

function searchFlights() {
    clearAllFlightErrors();

    const tripType = document.querySelector('input[name="tripType"]:checked').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const adults = parseInt(document.getElementById('adults').value) || 1;
    const children = parseInt(document.getElementById('children').value) || 0;
    const infants = parseInt(document.getElementById('infants').value) || 0;

    let isValid = true;

    if (!origin) {
        showError('originError', 'Please select an origin city');
        isValid = false;
    }

    if (!destination) {
        showError('destinationError', 'Please select a destination city');
        isValid = false;
    } else if (origin === destination) {
        showError('destinationError', 'Origin and destination cannot be the same');
        isValid = false;
    }

    if (!departureDate) {
        showError('departureDateError', 'Please select a departure date');
        isValid = false;
    } else {
        const depDate = new Date(departureDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (depDate < minDate || depDate > maxDate) {
            showError('departureDateError', 'Departure date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        }
    }

    if (tripType === 'roundtrip') {
        if (!returnDate) {
            showError('returnDateError', 'Please select a return date');
            isValid = false;
        } else {
            const retDate = new Date(returnDate);
            const depDate = new Date(departureDate);
            const minDate = new Date('2024-09-01');
            const maxDate = new Date('2024-12-01');

            if (retDate < minDate || retDate > maxDate) {
                showError('returnDateError', 'Return date must be between Sep 1, 2024 and Dec 1, 2024');
                isValid = false;
            } else if (retDate <= depDate) {
                showError('returnDateError', 'Return date must be after departure date');
                isValid = false;
            }
        }
    }

    if (adults > 4) {
        showError('adultsError', 'Maximum 4 adults allowed');
        isValid = false;
    }
    if (children > 4) {
        showError('childrenError', 'Maximum 4 children allowed');
        isValid = false;
    }
    if (infants > 4) {
        showError('infantsError', 'Maximum 4 infants allowed');
        isValid = false;
    }

    const totalPassengers = adults + children + infants;
    if (totalPassengers === 0) {
        showError('adultsError', 'At least one passenger required');
        isValid = false;
    }

    if (!isValid) return;

    // Display search summary
    displaySearchSummary({
        tripType,
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        children,
        infants
    });

    // ONLY use server-side search - removed localStorage fallback
    $.ajax({
        url: 'flight-search.php',
        type: 'POST',
        dataType: 'json',
        data: {
            tripType: tripType,
            origin: origin,
            destination: destination,
            departureDate: departureDate,
            returnDate: returnDate,
            adults: adults,
            children: children,
            infants: infants
        },
        success: function(response) {
            if (response.success) {
                displayFlightResults(response.departingFlights, response.returningFlights, tripType);
            } else {
                $('#resultsContent').html('<p style="color: red;">' + response.message + '</p>');
                $('#flightResults').show();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            $('#resultsContent').html('<p style="color: red;">Server error while searching for flights.</p>');
            $('#flightResults').show();
        }
    });
}

function displaySearchSummary(searchData) {
    const summaryDiv = document.getElementById('searchSummary');
    const summaryContent = document.getElementById('summaryContent');

    let summaryHTML = `
        <p><strong>Trip Type:</strong> ${searchData.tripType === 'oneway' ? 'One Way' : 'Round Trip'}</p>
        <p><strong>From:</strong> ${searchData.origin} <strong>To:</strong> ${searchData.destination}</p>
        <p><strong>Departure Date:</strong> ${searchData.departureDate}</p>
    `;

    if (searchData.tripType === 'roundtrip') {
        summaryHTML += `<p><strong>Return Date:</strong> ${searchData.returnDate}</p>`;
    }

    summaryHTML += `
        <p><strong>Passengers:</strong> 
            ${searchData.adults} Adult(s)
            ${searchData.children > 0 ? ', ' + searchData.children + ' Child(ren)' : ''}
            ${searchData.infants > 0 ? ', ' + searchData.infants + ' Infant(s)' : ''}
        </p>
    `;

    summaryContent.innerHTML = summaryHTML;
    summaryDiv.style.display = 'block';
}

function displayFlightResults(departingFlights, returningFlights, tripType) {
    const resultsDiv = document.getElementById('flightResults');
    const resultsContent = document.getElementById('resultsContent');

    // Check if elements exist
    if (!resultsDiv || !resultsContent) {
        console.error('Results elements not found in DOM');
        return;
    }

    let resultsHTML = '';

    if (!departingFlights || departingFlights.length === 0) {
        resultsHTML = '<p>No departing flights found for your search criteria.</p>';
    } else {
        resultsHTML = '<h4>Departing Flights</h4>';
        departingFlights.forEach(flight => {
            resultsHTML += `
                <div class="flight-item">
                    <p><strong>${flight.airline}</strong> - Flight ${flight.flight_id}</p>
                    <p>${flight.origin} → ${flight.destination}</p>
                    <p>Date: ${flight.departure_date}</p>
                    <p>Departure: ${flight.departure_time} | Arrival: ${flight.arrival_time}</p>
                    <p>Available Seats: ${flight.availableSeats}</p>
                    <p>Price: $${flight.price}</p>
                    <button class="btn" onclick="selectFlight('${flight.flight_id}', 'departing')">Select This Flight</button>
                </div>
            `;
        });
    }

    if (tripType === 'roundtrip') {
        if (!returningFlights || returningFlights.length === 0) {
            resultsHTML += '<h4>Returning Flights</h4><p>No returning flights found for your search criteria.</p>';
        } else {
            resultsHTML += '<h4>Returning Flights</h4>';
            returningFlights.forEach(flight => {
                resultsHTML += `
                    <div class="flight-item">
                        <p><strong>${flight.airline}</strong> - Flight ${flight.flight_id}</p>
                        <p>${flight.origin} → ${flight.destination}</p>
                        <p>Date: ${flight.departure_date}</p>
                        <p>Departure: ${flight.departure_time} | Arrival: ${flight.arrival_time}</p>
                        <p>Available Seats: ${flight.availableSeats}</p>
                        <p>Price: $${flight.price}</p>
                        <button class="btn" onclick="selectFlight('${flight.flight_id}', 'returning')">Select This Flight</button>
                    </div>
                `;
            });
        }
    }

    resultsContent.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
}

function selectFlight(flightId, type) {
    const adults = parseInt(document.getElementById('adults').value) || 1;
    const children = parseInt(document.getElementById('children').value) || 0;
    const infants = parseInt(document.getElementById('infants').value) || 0;

    $.post('flight-addcart.php', {
        flightId: flightId,
        type: type,
        adults: adults,
        children: children,
        infants: infants
    }, function(response) {
        if (response.success) {
            alert('Flight added to cart!');
            window.location.href = 'cart.html';
        } else {
            alert('Error: ' + response.message);
        }
    }, 'json').fail(function() {
        alert('Error adding flight to cart');
    });
}

function clearAllFlightErrors() {
    document.getElementById('originError').textContent = '';
    document.getElementById('destinationError').textContent = '';
    document.getElementById('departureDateError').textContent = '';
    document.getElementById('returnDateError').textContent = '';
    document.getElementById('adultsError').textContent = '';
    document.getElementById('childrenError').textContent = '';
    document.getElementById('infantsError').textContent = '';
}