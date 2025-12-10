document.addEventListener('DOMContentLoaded', function() {
    const staySearchForm = document.getElementById('staySearchForm');
    if (staySearchForm) {
        staySearchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            searchHotels();
        });
    }
});

function searchHotels() {
    clearAllErrors();

    const city = document.getElementById('city').value;
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const adults = parseInt(document.getElementById('adultGuests').value) || 1;
    const children = parseInt(document.getElementById('childGuests').value) || 0;
    const infants = parseInt(document.getElementById('infantGuests').value) || 0;

    let isValid = true;

    // Validate city
    if (!city) {
        showError('cityError', 'Please select a city');
        isValid = false;
    }

    // Validate check-in date
    if (!checkInDate) {
        showError('checkInError', 'Please select a check-in date');
        isValid = false;
    } else {
        const checkIn = new Date(checkInDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');
        if (checkIn < minDate || checkIn > maxDate) {
            showError('checkInError', 'Check-in date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        }
    }

    // Validate check-out date
    if (!checkOutDate) {
        showError('checkOutError', 'Please select a check-out date');
        isValid = false;
    } else {
        const checkOut = new Date(checkOutDate);
        const checkIn = new Date(checkInDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');
        
        if (checkOut < minDate || checkOut > maxDate) {
            showError('checkOutError', 'Check-out date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        } else if (checkOut <= checkIn) {
            showError('checkOutError', 'Check-out date must be after check-in date');
            isValid = false;
        }
    }

    // Validate guests
    if (adults < 1) {
        showError('adultGuestsError', 'At least 1 adult required');
        isValid = false;
    }
    if (children > 10) {
        showError('childGuestsError', 'Maximum 10 children allowed');
        isValid = false;
    }
    if (infants > 10) {
        showError('infantGuestsError', 'Maximum 10 infants allowed');
        isValid = false;
    }

    // Validate rooms needed (max 2 per room, infants don't count)
    const totalAdultsAndChildren = adults + children;
    const roomsNeeded = Math.ceil(totalAdultsAndChildren / 2);
    
    if (totalAdultsAndChildren === 0 || (adults === 0 && children === 0)) {
        showError('adultGuestsError', 'At least 1 adult or child required');
        isValid = false;
    }

    if (!isValid) return;

    // Display search summary
    displaySearchSummary({
        city,
        checkInDate,
        checkOutDate,
        adults,
        children,
        infants,
        roomsNeeded
    });

    // Search hotels from database
    $.ajax({
        url: 'hotel-search.php',
        type: 'POST',
        dataType: 'json',
        data: {
            city: city
        },
        success: function(response) {
            if (response.success) {
                displayHotelResults(response.hotels, {
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    adults: adults,
                    children: children,
                    infants: infants,
                    roomsNeeded: roomsNeeded
                });
            } else {
                $('#resultsContent').html('<p style="color: red;">' + response.message + '</p>');
                $('#hotelResults').show();
            }
        },
        error: function(err) {
            console.error('Error:', err);
            $('#resultsContent').html('<p style="color: red;">Server error while searching for hotels.</p>');
            $('#hotelResults').show();
        }
    });
}

function displaySearchSummary(searchData) {
    const summaryDiv = document.getElementById('searchSummary');
    const summaryContent = document.getElementById('summaryContent');

    let summaryHTML = `
        <p><strong>City:</strong> ${searchData.city}</p>
        <p><strong>Check-in Date:</strong> ${searchData.checkInDate}</p>
        <p><strong>Check-out Date:</strong> ${searchData.checkOutDate}</p>
        <p><strong>Guests:</strong> 
            ${searchData.adults} Adult(s)
            ${searchData.children > 0 ? ', ' + searchData.children + ' Child(ren)' : ''}
            ${searchData.infants > 0 ? ', ' + searchData.infants + ' Infant(s)' : ''}
        </p>
        <p><strong>Rooms Needed:</strong> ${searchData.roomsNeeded}</p>
    `;

    summaryContent.innerHTML = summaryHTML;
    summaryDiv.style.display = 'block';
}

function displayHotelResults(hotels, searchParams) {
    const resultsDiv = document.getElementById('hotelResults');
    const resultsContent = document.getElementById('resultsContent');

    if (!resultsDiv || !resultsContent) {
        console.error('Results elements not found in DOM');
        return;
    }

    let resultsHTML = '';

    if (!hotels || hotels.length === 0) {
        resultsHTML = '<p>No hotels found in this city.</p>';
    } else {
        hotels.forEach(hotel => {
            const nights = Math.ceil((new Date(searchParams.checkOutDate) - new Date(searchParams.checkInDate)) / (1000 * 60 * 60 * 24));
            const totalPrice = (hotel.price_per_night * searchParams.roomsNeeded * nights).toFixed(2);

            resultsHTML += `
                <div class="hotel-item" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px;">
                    <p><strong>Hotel ID:</strong> ${hotel.hotel_id}</p>
                    <p><strong>Name:</strong> ${hotel.name}</p>
                    <p><strong>City:</strong> ${hotel.city}</p>
                    <p><strong>Price per Night (per room):</strong> $${parseFloat(hotel.price_per_night).toFixed(2)}</p>
                    <p><strong>Rooms Needed:</strong> ${searchParams.roomsNeeded}</p>
                    <p><strong>Number of Nights:</strong> ${nights}</p>
                    <p><strong>Total Price (${nights} nights × ${searchParams.roomsNeeded} rooms):</strong> $${totalPrice}</p>
                    <button class="btn" onclick="selectHotel('${hotel.hotel_id}', '${hotel.name}', '${hotel.city}', '${hotel.price_per_night}', '${searchParams.checkInDate}', '${searchParams.checkOutDate}', '${searchParams.roomsNeeded}', '${searchParams.adults}', '${searchParams.children}', '${searchParams.infants}')">Select This Hotel</button>
                </div>
            `;
        });
    }

    resultsContent.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
}

function selectHotel(hotelId, hotelName, city, pricePerNight, checkInDate, checkOutDate, roomsNeeded, adults, children, infants) {
    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = (pricePerNight * roomsNeeded * nights).toFixed(2);

    const hotelData = {
        hotelId: hotelId,
        hotelName: hotelName,
        city: city,
        pricePerNight: parseFloat(pricePerNight),
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        roomsNeeded: parseInt(roomsNeeded),
        nights: nights,
        totalPrice: parseFloat(totalPrice),
        adults: parseInt(adults),
        children: parseInt(children),
        infants: parseInt(infants)
    };

    // Store in sessionStorage
    sessionStorage.setItem('hotelCart', JSON.stringify(hotelData));
    
    alert('Hotel added to cart!');
    window.location.href = 'cart.html';
}

function clearAllErrors() {
    document.getElementById('cityError').textContent = '';
    document.getElementById('checkInError').textContent = '';
    document.getElementById('checkOutError').textContent = '';
    document.getElementById('adultGuestsError').textContent = '';
    document.getElementById('childGuestsError').textContent = '';
    document.getElementById('infantGuestsError').textContent = '';
}

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.color = 'red';
    }
}