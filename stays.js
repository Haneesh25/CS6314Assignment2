let availableHotels = [];

document.addEventListener('DOMContentLoaded', function() {

    initializeHotels();


    const staySearchForm = document.getElementById('staySearchForm');
    if (staySearchForm) {
        staySearchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            searchHotels();
        });
    }
});

function initializeHotels() {

    const hotelData = `<?xml version="1.0" encoding="UTF-8"?>
<hotels>
    <hotel>
        <hotelId>H001</hotelId>
        <hotelName>Grand Plaza Hotel</hotelName>
        <city>Houston</city>
        <availableRooms>15</availableRooms>
        <pricePerNight>120</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H002</hotelId>
        <hotelName>Comfort Inn Dallas</hotelName>
        <city>Dallas</city>
        <availableRooms>20</availableRooms>
        <pricePerNight>95</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H003</hotelId>
        <hotelName>Austin Suites</hotelName>
        <city>Austin</city>
        <availableRooms>12</availableRooms>
        <pricePerNight>110</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H004</hotelId>
        <hotelName>Riverwalk Resort</hotelName>
        <city>San Antonio</city>
        <availableRooms>25</availableRooms>
        <pricePerNight>130</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H005</hotelId>
        <hotelName>Fort Worth Inn</hotelName>
        <city>Fort Worth</city>
        <availableRooms>18</availableRooms>
        <pricePerNight>85</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H006</hotelId>
        <hotelName>El Paso Lodge</hotelName>
        <city>El Paso</city>
        <availableRooms>10</availableRooms>
        <pricePerNight>75</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H007</hotelId>
        <hotelName>Hollywood Hotel</hotelName>
        <city>Los Angeles</city>
        <availableRooms>30</availableRooms>
        <pricePerNight>180</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H008</hotelId>
        <hotelName>Golden Gate Inn</hotelName>
        <city>San Francisco</city>
        <availableRooms>22</availableRooms>
        <pricePerNight>200</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H009</hotelId>
        <hotelName>Beach Resort SD</hotelName>
        <city>San Diego</city>
        <availableRooms>28</availableRooms>
        <pricePerNight>165</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H010</hotelId>
        <hotelName>Capitol Suites</hotelName>
        <city>Sacramento</city>
        <availableRooms>16</availableRooms>
        <pricePerNight>105</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H011</hotelId>
        <hotelName>Tech Hotel SJ</hotelName>
        <city>San Jose</city>
        <availableRooms>14</availableRooms>
        <pricePerNight>155</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H012</hotelId>
        <hotelName>Valley Inn Fresno</hotelName>
        <city>Fresno</city>
        <availableRooms>12</availableRooms>
        <pricePerNight>80</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H013</hotelId>
        <hotelName>Luxury Towers Houston</hotelName>
        <city>Houston</city>
        <availableRooms>8</availableRooms>
        <pricePerNight>250</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H014</hotelId>
        <hotelName>Downtown Dallas Hotel</hotelName>
        <city>Dallas</city>
        <availableRooms>19</availableRooms>
        <pricePerNight>140</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H015</hotelId>
        <hotelName>Music City Hotel</hotelName>
        <city>Austin</city>
        <availableRooms>21</availableRooms>
        <pricePerNight>125</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H016</hotelId>
        <hotelName>LA Beach Hotel</hotelName>
        <city>Los Angeles</city>
        <availableRooms>35</availableRooms>
        <pricePerNight>195</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H017</hotelId>
        <hotelName>Bay Area Lodge</hotelName>
        <city>San Francisco</city>
        <availableRooms>17</availableRooms>
        <pricePerNight>185</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H018</hotelId>
        <hotelName>Harbor View SD</hotelName>
        <city>San Diego</city>
        <availableRooms>24</availableRooms>
        <pricePerNight>175</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H019</hotelId>
        <hotelName>Budget Inn Houston</hotelName>
        <city>Houston</city>
        <availableRooms>40</availableRooms>
        <pricePerNight>65</pricePerNight>
    </hotel>
    <hotel>
        <hotelId>H020</hotelId>
        <hotelName>Executive Suites Dallas</hotelName>
        <city>Dallas</city>
        <availableRooms>11</availableRooms>
        <pricePerNight>160</pricePerNight>
    </hotel>
</hotels>`;


    localStorage.setItem('availableHotels', hotelData);


    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(hotelData, 'text/xml');
    const hotels = xmlDoc.getElementsByTagName('hotel');

    availableHotels = [];
    for (let i = 0; i < hotels.length; i++) {
        availableHotels.push({
            hotelId: hotels[i].getElementsByTagName('hotelId')[0].textContent,
            hotelName: hotels[i].getElementsByTagName('hotelName')[0].textContent,
            city: hotels[i].getElementsByTagName('city')[0].textContent,
            availableRooms: parseInt(hotels[i].getElementsByTagName('availableRooms')[0].textContent),
            pricePerNight: parseFloat(hotels[i].getElementsByTagName('pricePerNight')[0].textContent)
        });
    }
}

function searchHotels() {

    clearAllStayErrors();


    const city = document.getElementById('city').value;
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const adultGuests = parseInt(document.getElementById('adultGuests').value) || 1;
    const childGuests = parseInt(document.getElementById('childGuests').value) || 0;
    const infantGuests = parseInt(document.getElementById('infantGuests').value) || 0;

    let isValid = true;


    if (!city) {
        showError('cityError', 'Please select a city');
        isValid = false;
    }


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


    const totalGuestsExcludingInfants = adultGuests + childGuests;
    const roomsNeeded = Math.ceil(totalGuestsExcludingInfants / 2);




    if (isValid) {

        displayStaySummary({
            city,
            checkInDate,
            checkOutDate,
            adultGuests,
            childGuests,
            infantGuests,
            roomsNeeded
        });


        findAvailableHotels(city, roomsNeeded);
    }
}

function displayStaySummary(searchData) {
    const summaryDiv = document.getElementById('searchSummary');
    const summaryContent = document.getElementById('summaryContent');

    const checkIn = new Date(searchData.checkInDate);
    const checkOut = new Date(searchData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    let summaryHTML = `
        <p><strong>City:</strong> ${searchData.city}</p>
        <p><strong>Check-in:</strong> ${searchData.checkInDate}</p>
        <p><strong>Check-out:</strong> ${searchData.checkOutDate}</p>
        <p><strong>Number of Nights:</strong> ${nights}</p>
        <p><strong>Guests:</strong> 
            ${searchData.adultGuests} Adult(s)
            ${searchData.childGuests > 0 ? ', ' + searchData.childGuests + ' Child(ren)' : ''}
            ${searchData.infantGuests > 0 ? ', ' + searchData.infantGuests + ' Infant(s)' : ''}
        </p>
        <p><strong>Rooms Needed:</strong> ${searchData.roomsNeeded}</p>
    `;

    summaryContent.innerHTML = summaryHTML;
    summaryDiv.style.display = 'block';
}

function findAvailableHotels(city, roomsNeeded) {
    const resultsDiv = document.getElementById('hotelResults');
    const resultsContent = document.getElementById('resultsContent');


    const cityHotels = availableHotels.filter(hotel =>
        hotel.city === city && hotel.availableRooms >= roomsNeeded
    );

    let resultsHTML = '';

    if (cityHotels.length === 0) {
        resultsHTML = '<p>No hotels available in ' + city + ' with enough rooms for your stay.</p>';
    } else {
        cityHotels.forEach(hotel => {
            resultsHTML += `
                <div class="flight-item">
                    <p><strong>${hotel.hotelName}</strong></p>
                    <p>Hotel ID: ${hotel.hotelId}</p>
                    <p>City: ${hotel.city}</p>
                    <p>Available Rooms: ${hotel.availableRooms}</p>
                    <p>Price per Night: $${hotel.pricePerNight}</p>
                    <button class="btn" onclick="selectHotel('${hotel.hotelId}')">Select This Hotel</button>
                </div>
            `;
        });
    }

    resultsContent.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
}

function selectHotel(hotelId) {
    const hotel = availableHotels.find(h => h.hotelId === hotelId);

    if (hotel) {

        const checkInDate = document.getElementById('checkInDate').value;
        const checkOutDate = document.getElementById('checkOutDate').value;
        const adultGuests = parseInt(document.getElementById('adultGuests').value) || 1;
        const childGuests = parseInt(document.getElementById('childGuests').value) || 0;
        const infantGuests = parseInt(document.getElementById('infantGuests').value) || 0;

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const roomsNeeded = Math.ceil((adultGuests + childGuests) / 2);


        const hotelCart = {
            hotel: hotel,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            nights: nights,
            roomsNeeded: roomsNeeded,
            adultGuests: adultGuests,
            childGuests: childGuests,
            infantGuests: infantGuests,
            totalPrice: hotel.pricePerNight * roomsNeeded * nights
        };

        localStorage.setItem('hotelCart', JSON.stringify(hotelCart));

        alert(`${hotel.hotelName} added to cart!`);

        if (confirm('Would you like to go to the cart to complete your booking?')) {
            window.location.href = 'cart.html';
        }
    }
}

function clearAllStayErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}