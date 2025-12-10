$(document).ready(function() {

    $('#cruiseSearchForm').on('submit', function(event) {
        event.preventDefault();
        searchCruises();
    });
});

function searchCruises() {

    $('.error').text('');


    const destination = $('#cruiseDestination').val();
    const minDuration = parseInt($('#minDuration').val());
    const maxDuration = parseInt($('#maxDuration').val());
    const departStartDate = $('#departStartDate').val();
    const departEndDate = $('#departEndDate').val();
    const adults = parseInt($('#cruiseAdults').val()) || 1;
    const children = parseInt($('#cruiseChildren').val()) || 0;
    const infants = parseInt($('#cruiseInfants').val()) || 0;

    let isValid = true;


    if (!destination) {
        $('#destinationError').text('Please select a destination');
        isValid = false;
    } else if (!['Alaska', 'Bahamas', 'Europe', 'Mexico'].includes(destination)) {
        $('#destinationError').text('Destination must be Alaska, Bahamas, Europe, or Mexico');
        isValid = false;
    }


    if (!minDuration || minDuration < 3) {
        $('#minDurationError').text('Minimum duration cannot be less than 3 days');
        isValid = false;
    }


    if (!maxDuration || maxDuration > 10) {
        $('#maxDurationError').text('Maximum duration cannot be greater than 10 days');
        isValid = false;
    }


    if (minDuration > maxDuration) {
        $('#maxDurationError').text('Maximum duration must be greater than or equal to minimum duration');
        isValid = false;
    }


    if (!departStartDate) {
        $('#departStartError').text('Please select a start date for departure');
        isValid = false;
    } else {
        const startDate = new Date(departStartDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (startDate < minDate || startDate > maxDate) {
            $('#departStartError').text('Start date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        }
    }


    if (!departEndDate) {
        $('#departEndError').text('Please select an end date for departure');
        isValid = false;
    } else {
        const endDate = new Date(departEndDate);
        const startDate = new Date(departStartDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (endDate < minDate || endDate > maxDate) {
            $('#departEndError').text('End date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        } else if (endDate < startDate) {
            $('#departEndError').text('End date must be after or equal to start date');
            isValid = false;
        }
    }


    const totalGuestsExcludingInfants = adults + children;
    const roomsNeeded = Math.ceil(totalGuestsExcludingInfants / 2);

    if (isValid) {

        displayCruiseSummary({
            destination,
            minDuration,
            maxDuration,
            departStartDate,
            departEndDate,
            adults,
            children,
            infants,
            roomsNeeded
        });


        displaySampleCruises({
            destination,
            minDuration,
            maxDuration,
            departStartDate,
            departEndDate,
            roomsNeeded
        });
    }
}

function displayCruiseSummary(searchData) {

    const summaryHTML = `
        <p><strong>Destination:</strong> ${searchData.destination}</p>
        <p><strong>Duration Range:</strong> ${searchData.minDuration} - ${searchData.maxDuration} days</p>
        <p><strong>Departure Between:</strong> ${searchData.departStartDate} to ${searchData.departEndDate}</p>
        <p><strong>Guests:</strong> 
            ${searchData.adults} Adult(s)
            ${searchData.children > 0 ? ', ' + searchData.children + ' Child(ren)' : ''}
            ${searchData.infants > 0 ? ', ' + searchData.infants + ' Infant(s)' : ''}
        </p>
        <p><strong>Rooms Needed:</strong> ${searchData.roomsNeeded}</p>
    `;

    $('#summaryContent').html(summaryHTML);
    $('#searchSummary').show();
}

function displaySampleCruises(criteria) {

    const cruiseLines = ['Royal Caribbean', 'Carnival', 'Norwegian', 'Princess'];
    const cruises = [];


    for (let i = 1; i <= 5; i++) {
        const duration = criteria.minDuration + Math.floor(Math.random() * (criteria.maxDuration - criteria.minDuration + 1));
        const basePrice = 500 + (duration * 100) + Math.floor(Math.random() * 500);


        const startDate = new Date(criteria.departStartDate);
        const endDate = new Date(criteria.departEndDate);
        const timeDiff = endDate - startDate;
        const randomTime = Math.random() * timeDiff;
        const departureDate = new Date(startDate.getTime() + randomTime);

        cruises.push({
            id: 'CR' + String(1000 + i),
            line: cruiseLines[Math.floor(Math.random() * cruiseLines.length)],
            destination: criteria.destination,
            duration: duration,
            departureDate: departureDate.toISOString().split('T')[0],
            pricePerPerson: basePrice,
            availableRooms: 10 + Math.floor(Math.random() * 20)
        });
    }


    let resultsHTML = '';

    if (cruises.length === 0) {
        resultsHTML = '<p>No cruises available matching your criteria.</p>';
    } else {
        cruises.forEach(cruise => {
            resultsHTML += `
                <div class="flight-item">
                    <p><strong>${cruise.line} - ${cruise.destination} Cruise</strong></p>
                    <p>Cruise ID: ${cruise.id}</p>
                    <p>Duration: ${cruise.duration} days</p>
                    <p>Departure: ${cruise.departureDate}</p>
                    <p>Available Rooms: ${cruise.availableRooms}</p>
                    <p>Price per Person: $${cruise.pricePerPerson}</p>
                    <button class="btn" onclick="selectCruise('${cruise.id}', '${cruise.line}', '${cruise.destination}', ${cruise.duration}, '${cruise.departureDate}', ${cruise.pricePerPerson})">
                        Select This Cruise
                    </button>
                </div>
            `;
        });
    }

    $('#resultsContent').html(resultsHTML);
    $('#cruiseResults').show();
}

function selectCruise(cruiseId, line, destination, duration, departureDate, pricePerPerson) {

    const adults = parseInt($('#cruiseAdults').val()) || 1;
    const children = parseInt($('#cruiseChildren').val()) || 0;
    const infants = parseInt($('#cruiseInfants').val()) || 0;

    const roomsNeeded = Math.ceil((adults + children) / 2);
    const totalPrice = (adults * pricePerPerson) + (children * pricePerPerson * 0.5) + (infants * pricePerPerson * 0.1);


    const cruiseCart = {
        cruiseId: cruiseId,
        line: line,
        destination: destination,
        duration: duration,
        departureDate: departureDate,
        adults: adults,
        children: children,
        infants: infants,
        roomsNeeded: roomsNeeded,
        pricePerPerson: pricePerPerson,
        totalPrice: totalPrice
    };


    localStorage.setItem('cruiseCart', JSON.stringify(cruiseCart));

    alert(`${line} ${destination} Cruise added to cart!\nTotal: $${totalPrice.toFixed(2)}`);

    if (confirm('Would you like to go to the cart to complete your booking?')) {
        window.location.href = 'cart.html';
    }
}


function clearCruiseErrors() {
    $('.error').text('');
}