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
        let maxDay = month === 12 ? 1 : 30;
        if (month === 9 || month === 11) maxDay = 30;
        if (month === 10) maxDay = 31;

        for (let day = 1; day <= maxDay; day++) {

            if (month === 12 && day > 1) break;


            for (let i = 0; i < 2; i++) {
                const origin = texasCities[Math.floor(Math.random() * texasCities.length)];
                const destination = californiaCities[Math.floor(Math.random() * californiaCities.length)];
                const airline = airlines[Math.floor(Math.random() * airlines.length)];

                const departureHour = 6 + Math.floor(Math.random() * 14);
                const flightDuration = 2 + Math.random() * 2;
                const arrivalHour = departureHour + Math.floor(flightDuration);

                flightData.push({
                    flightId: 'FL' + flightId++,
                    airline: airline,
                    origin: origin,
                    destination: destination,
                    departureDate: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    arrivalDate: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    departureTime: `${String(departureHour).padStart(2, '0')}:00`,
                    arrivalTime: `${String(arrivalHour % 24).padStart(2, '0')}:30`,
                    availableSeats: Math.floor(Math.random() * 20) + 5,
                    price: 150 + Math.floor(Math.random() * 300)
                });


                flightData.push({
                    flightId: 'FL' + flightId++,
                    airline: airline,
                    origin: destination,
                    destination: origin,
                    departureDate: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    arrivalDate: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    departureTime: `${String((departureHour + 6) % 24).padStart(2, '0')}:00`,
                    arrivalTime: `${String((arrivalHour + 6) % 24).padStart(2, '0')}:30`,
                    availableSeats: Math.floor(Math.random() * 20) + 5,
                    price: 150 + Math.floor(Math.random() * 300)
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

    const totalPassengers = adults + children;
    if (totalPassengers === 0) {
        showError('adultsError', 'At least one adult or child passenger required');
        isValid = false;
    }

    if (isValid) {

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


        findAvailableFlights({
            tripType,
            origin,
            destination,
            departureDate,
            returnDate,
            totalPassengers: adults + children + infants
        });
    }
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

function findAvailableFlights(searchCriteria) {
    const flightsData = JSON.parse(localStorage.getItem('availableFlights')) || [];


    let departingFlights = flightsData.filter(flight =>
        flight.origin === searchCriteria.origin &&
        flight.destination === searchCriteria.destination &&
        flight.departureDate === searchCriteria.departureDate &&
        flight.availableSeats >= searchCriteria.totalPassengers
    );


    if (departingFlights.length === 0) {
        const searchDate = new Date(searchCriteria.departureDate);
        const minDate = new Date(searchDate);
        minDate.setDate(minDate.getDate() - 3);
        const maxDate = new Date(searchDate);
        maxDate.setDate(maxDate.getDate() + 3);

        departingFlights = flightsData.filter(flight => {
            const flightDate = new Date(flight.departureDate);
            return flight.origin === searchCriteria.origin &&
                flight.destination === searchCriteria.destination &&
                flightDate >= minDate &&
                flightDate <= maxDate &&
                flight.availableSeats >= searchCriteria.totalPassengers;
        });
    }

    let returningFlights = [];
    if (searchCriteria.tripType === 'roundtrip') {

        returningFlights = flightsData.filter(flight =>
            flight.origin === searchCriteria.destination &&
            flight.destination === searchCriteria.origin &&
            flight.departureDate === searchCriteria.returnDate &&
            flight.availableSeats >= searchCriteria.totalPassengers
        );


        if (returningFlights.length === 0) {
            const searchDate = new Date(searchCriteria.returnDate);
            const minDate = new Date(searchDate);
            minDate.setDate(minDate.getDate() - 3);
            const maxDate = new Date(searchDate);
            maxDate.setDate(maxDate.getDate() + 3);

            returningFlights = flightsData.filter(flight => {
                const flightDate = new Date(flight.departureDate);
                return flight.origin === searchCriteria.destination &&
                    flight.destination === searchCriteria.origin &&
                    flightDate >= minDate &&
                    flightDate <= maxDate &&
                    flight.availableSeats >= searchCriteria.totalPassengers;
            });
        }
    }

    displayFlightResults(departingFlights, returningFlights, searchCriteria.tripType);
}

function displayFlightResults(departingFlights, returningFlights, tripType) {
    const resultsDiv = document.getElementById('flightResults');
    const resultsContent = document.getElementById('resultsContent');

    let resultsHTML = '';

    if (departingFlights.length === 0) {
        resultsHTML = '<p>No departing flights found for your search criteria.</p>';
    } else {
        resultsHTML = '<h4>Departing Flights</h4>';
        departingFlights.forEach(flight => {
            resultsHTML += `
                <div class="flight-item">
                    <p><strong>${flight.airline}</strong> - Flight ${flight.flightId}</p>
                    <p>${flight.origin} → ${flight.destination}</p>
                    <p>Date: ${flight.departureDate}</p>
                    <p>Departure: ${flight.departureTime} | Arrival: ${flight.arrivalTime}</p>
                    <p>Available Seats: ${flight.availableSeats}</p>
                    <p>Price: $${flight.price}</p>
                    <button class="btn" onclick="selectFlight('${flight.flightId}', 'departing')">Select This Flight</button>
                </div>
            `;
        });
    }

    if (tripType === 'roundtrip') {
        if (returningFlights.length === 0) {
            resultsHTML += '<h4>Returning Flights</h4><p>No returning flights found for your search criteria.</p>';
        } else {
            resultsHTML += '<h4>Returning Flights</h4>';
            returningFlights.forEach(flight => {
                resultsHTML += `
                    <div class="flight-item">
                        <p><strong>${flight.airline}</strong> - Flight ${flight.flightId}</p>
                        <p>${flight.origin} → ${flight.destination}</p>
                        <p>Date: ${flight.departureDate}</p>
                        <p>Departure: ${flight.departureTime} | Arrival: ${flight.arrivalTime}</p>
                        <p>Available Seats: ${flight.availableSeats}</p>
                        <p>Price: $${flight.price}</p>
                        <button class="btn" onclick="selectFlight('${flight.flightId}', 'returning')">Select This Flight</button>
                    </div>
                `;
            });
        }
    }

    resultsContent.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
}

function selectFlight(flightId, type) {
    const flightsData = JSON.parse(localStorage.getItem('availableFlights')) || [];
    const flight = flightsData.find(f => f.flightId === flightId);

    if (flight) {

        const adults = parseInt(document.getElementById('adults').value) || 1;
        const children = parseInt(document.getElementById('children').value) || 0;
        const infants = parseInt(document.getElementById('infants').value) || 0;


        let cart = JSON.parse(localStorage.getItem('flightCart')) || {};

        if (type === 'departing') {
            cart.departingFlight = {
                ...flight,
                adults: adults,
                children: children,
                infants: infants
            };
        } else {
            cart.returningFlight = {
                ...flight,
                adults: adults,
                children: children,
                infants: infants
            };
        }

        localStorage.setItem('flightCart', JSON.stringify(cart));

        alert(`Flight ${flightId} added to cart!`);


        const tripType = document.querySelector('input[name="tripType"]:checked').value;
        if (tripType === 'oneway' || (tripType === 'roundtrip' && cart.departingFlight && cart.returningFlight)) {
            if (confirm('Would you like to go to the cart to complete your booking?')) {
                window.location.href = 'cart.html';
            }
        }
    }
}

function clearAllFlightErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}