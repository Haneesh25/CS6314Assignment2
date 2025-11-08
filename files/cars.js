let availableCars = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeCars();

    const carSearchForm = document.getElementById('carSearchForm');
    if (carSearchForm) {
        carSearchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            searchCars();
        });
    }
});

function initializeCars() {
    const carsXML = `<?xml version="1.0" encoding="UTF-8"?>
<cars>
    <car>
        <carId>C001</carId>
        <city>Houston</city>
        <carType>Economy</carType>
        <pricePerDay>35</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C002</carId>
        <city>Houston</city>
        <carType>SUV</carType>
        <pricePerDay>65</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C003</carId>
        <city>Dallas</city>
        <carType>Compact</carType>
        <pricePerDay>40</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C004</carId>
        <city>Dallas</city>
        <carType>Midsize</carType>
        <pricePerDay>50</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C005</carId>
        <city>Austin</city>
        <carType>Economy</carType>
        <pricePerDay>38</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C006</carId>
        <city>San Antonio</city>
        <carType>SUV</carType>
        <pricePerDay>70</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C007</carId>
        <city>Los Angeles</city>
        <carType>Economy</carType>
        <pricePerDay>45</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C008</carId>
        <city>Los Angeles</city>
        <carType>Compact</carType>
        <pricePerDay>48</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C009</carId>
        <city>San Francisco</city>
        <carType>Midsize</carType>
        <pricePerDay>55</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C010</carId>
        <city>San Francisco</city>
        <carType>SUV</carType>
        <pricePerDay>75</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C011</carId>
        <city>San Diego</city>
        <carType>Economy</carType>
        <pricePerDay>42</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C012</carId>
        <city>Sacramento</city>
        <carType>Compact</carType>
        <pricePerDay>43</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C013</carId>
        <city>Fort Worth</city>
        <carType>Midsize</carType>
        <pricePerDay>47</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C014</carId>
        <city>El Paso</city>
        <carType>Economy</carType>
        <pricePerDay>36</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C015</carId>
        <city>San Jose</city>
        <carType>SUV</carType>
        <pricePerDay>68</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C016</carId>
        <city>Fresno</city>
        <carType>Compact</carType>
        <pricePerDay>39</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C017</carId>
        <city>Austin</city>
        <carType>SUV</carType>
        <pricePerDay>72</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C018</carId>
        <city>Houston</city>
        <carType>Midsize</carType>
        <pricePerDay>52</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C019</carId>
        <city>Los Angeles</city>
        <carType>SUV</carType>
        <pricePerDay>80</pricePerDay>
        <available>true</available>
    </car>
    <car>
        <carId>C020</carId>
        <city>Dallas</city>
        <carType>Economy</carType>
        <pricePerDay>37</pricePerDay>
        <available>true</available>
    </car>
</cars>`;

    localStorage.setItem('availableCars', carsXML);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(carsXML, 'text/xml');
    const cars = xmlDoc.getElementsByTagName('car');

    availableCars = [];
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        const carObj = {
            carId: car.getElementsByTagName('carId')[0].textContent,
            city: car.getElementsByTagName('city')[0].textContent,
            carType: car.getElementsByTagName('carType')[0].textContent,
            pricePerDay: parseFloat(car.getElementsByTagName('pricePerDay')[0].textContent),
            available: car.getElementsByTagName('available')[0].textContent === 'true'
        };
        availableCars.push(carObj);
    }
}

function searchCars() {
    clearAllCarErrors();

    const cityElement = document.getElementById('carCity');
    const typeElement = document.getElementById('carType');
    const checkInElement = document.getElementById('carCheckIn');
    const checkOutElement = document.getElementById('carCheckOut');

    const city = cityElement.value;
    const carType = typeElement.value;
    const checkInDate = checkInElement.value;
    const checkOutDate = checkOutElement.value;

    let isValid = true;

    if (!city) {
        showCarError('carCityError', 'Please select a city');
        isValid = false;
    }

    if (!carType) {
        showCarError('carTypeError', 'Please select a car type');
        isValid = false;
    } else if (!['Economy', 'Compact', 'Midsize', 'SUV'].includes(carType)) {
        showCarError('carTypeError', 'Car type must be Economy, Compact, Midsize, or SUV');
        isValid = false;
    }

    if (!checkInDate) {
        showCarError('carCheckInError', 'Please select a pick-up date');
        isValid = false;
    } else {
        const checkIn = new Date(checkInDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (checkIn < minDate || checkIn > maxDate) {
            showCarError('carCheckInError', 'Pick-up date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        }
    }

    if (!checkOutDate) {
        showCarError('carCheckOutError', 'Please select a drop-off date');
        isValid = false;
    } else {
        const checkOut = new Date(checkOutDate);
        const checkIn = new Date(checkInDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (checkOut < minDate || checkOut > maxDate) {
            showCarError('carCheckOutError', 'Drop-off date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        } else if (checkOut <= checkIn) {
            showCarError('carCheckOutError', 'Drop-off date must be after pick-up date');
            isValid = false;
        }
    }

    if (isValid) {
        displayCarSummary({
            city,
            carType,
            checkInDate,
            checkOutDate
        });

        showSuggestedCars(city, carType, checkInDate, checkOutDate);

        findAvailableCars(city, carType);
    }
}

function displayCarSummary(searchData) {
    const summaryDiv = document.getElementById('searchSummary');
    const summaryContent = document.getElementById('summaryContent');

    const checkIn = new Date(searchData.checkInDate);
    const checkOut = new Date(searchData.checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    while (summaryContent.firstChild) {
        summaryContent.removeChild(summaryContent.firstChild);
    }

    const cityP = document.createElement('p');
    cityP.innerHTML = '<strong>City:</strong> ' + searchData.city;
    summaryContent.appendChild(cityP);

    const typeP = document.createElement('p');
    typeP.innerHTML = '<strong>Car Type:</strong> ' + searchData.carType;
    summaryContent.appendChild(typeP);

    const pickupP = document.createElement('p');
    pickupP.innerHTML = '<strong>Pick-up Date:</strong> ' + searchData.checkInDate;
    summaryContent.appendChild(pickupP);

    const dropoffP = document.createElement('p');
    dropoffP.innerHTML = '<strong>Drop-off Date:</strong> ' + searchData.checkOutDate;
    summaryContent.appendChild(dropoffP);

    const daysP = document.createElement('p');
    daysP.innerHTML = '<strong>Rental Duration:</strong> ' + days + ' day(s)';
    summaryContent.appendChild(daysP);

    summaryDiv.style.display = 'block';
}

function showSuggestedCars(city, carType, checkInDate, checkOutDate) {
    const previousBookings = JSON.parse(localStorage.getItem('carBookings')) || [];
    const suggestedDiv = document.getElementById('suggestedCars');
    const suggestedContent = document.getElementById('suggestedContent');

    while (suggestedContent.firstChild) {
        suggestedContent.removeChild(suggestedContent.firstChild);
    }

    let suggestedCarsList = availableCars.filter(car =>
        car.city === city && car.available
    );

    if (previousBookings.length > 0) {
        const preferredTypes = [...new Set(previousBookings.map(b => b.carType))];
        suggestedCarsList = suggestedCarsList.sort((a, b) => {
            const aPreferred = preferredTypes.includes(a.carType);
            const bPreferred = preferredTypes.includes(b.carType);
            if (aPreferred && !bPreferred) return -1;
            if (!aPreferred && bPreferred) return 1;
            return 0;
        });
    }

    const suggestions = suggestedCarsList.slice(0, 3);

    if (suggestions.length > 0) {
        const heading = document.createElement('p');
        heading.textContent = 'Based on your location and dates, we recommend:';
        suggestedContent.appendChild(heading);

        suggestions.forEach(car => {
            const carDiv = document.createElement('div');
            carDiv.className = 'flight-item';

            const carInfo = document.createElement('p');
            carInfo.innerHTML = `<strong>${car.carType} - $${car.pricePerDay}/day</strong><br>
                                 Car ID: ${car.carId}<br>
                                 Quick booking available`;
            carDiv.appendChild(carInfo);

            const selectBtn = document.createElement('button');
            selectBtn.className = 'btn';
            selectBtn.textContent = 'Quick Book This Car';
            selectBtn.onclick = function() {
                selectCar(car.carId, checkInDate, checkOutDate);
            };
            carDiv.appendChild(selectBtn);

            suggestedContent.appendChild(carDiv);
        });

        suggestedDiv.style.display = 'block';
    }
}

function findAvailableCars(city, carType) {
    const resultsDiv = document.getElementById('carResults');
    const resultsContent = document.getElementById('resultsContent');

    while (resultsContent.firstChild) {
        resultsContent.removeChild(resultsContent.firstChild);
    }

    const matchingCars = availableCars.filter(car =>
        car.city === city && car.carType === carType && car.available
    );

    if (matchingCars.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No cars available matching your criteria.';
        resultsContent.appendChild(noResults);
    } else {
        matchingCars.forEach(car => {
            const carDiv = document.createElement('div');
            carDiv.className = 'flight-item';

            const carDetails = document.createElement('div');

            const carTitle = document.createElement('p');
            carTitle.innerHTML = `<strong>${car.carType} Car</strong>`;
            carDetails.appendChild(carTitle);

            const carId = document.createElement('p');
            carId.textContent = 'Car ID: ' + car.carId;
            carDetails.appendChild(carId);

            const carCity = document.createElement('p');
            carCity.textContent = 'Location: ' + car.city;
            carDetails.appendChild(carCity);

            const carPrice = document.createElement('p');
            carPrice.textContent = 'Price per Day: $' + car.pricePerDay;
            carDetails.appendChild(carPrice);

            const checkIn = document.getElementById('carCheckIn').value;
            const checkOut = document.getElementById('carCheckOut').value;

            const selectBtn = document.createElement('button');
            selectBtn.className = 'btn';
            selectBtn.textContent = 'Select This Car';
            selectBtn.onclick = function() {
                selectCar(car.carId, checkIn, checkOut);
            };

            carDiv.appendChild(carDetails);
            carDiv.appendChild(selectBtn);
            resultsContent.appendChild(carDiv);
        });
    }

    resultsDiv.style.display = 'block';
}

function selectCar(carId, checkInDate, checkOutDate) {
    const car = availableCars.find(c => c.carId === carId);

    if (car) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = car.pricePerDay * days;

        const carCart = {
            car: car,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            days: days,
            totalPrice: totalPrice
        };

        localStorage.setItem('carCart', JSON.stringify(carCart));

        alert(`${car.carType} car in ${car.city} added to cart!\nTotal: $${totalPrice} for ${days} day(s)`);

        if (confirm('Would you like to go to the cart to complete your booking?')) {
            window.location.href = 'cart.html';
        }
    }
}

function showCarError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.className = 'error';
    }
}

function clearAllCarErrors() {
    const errorElements = document.getElementsByClassName('error');
    for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].textContent = '';
    }
}