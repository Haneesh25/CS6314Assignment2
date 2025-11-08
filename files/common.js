function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const dateTimeString = now.toLocaleDateString('en-US', options);
    document.getElementById('datetime').textContent = dateTimeString;
}


document.addEventListener('DOMContentLoaded', function() {

    updateDateTime();
    setInterval(updateDateTime, 1000);


    const fontSizeSelect = document.getElementById('fontSize');
    if (fontSizeSelect) {

        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            fontSizeSelect.value = savedFontSize;
            document.querySelector('.main-content').style.fontSize = savedFontSize;
        }

        fontSizeSelect.addEventListener('change', function() {
            const newSize = this.value;
            document.querySelector('.main-content').style.fontSize = newSize;
            localStorage.setItem('fontSize', newSize);
        });
    }


    const bgColorInput = document.getElementById('bgColor');
    if (bgColorInput) {

        const savedBgColor = localStorage.getItem('bgColor');
        if (savedBgColor) {
            bgColorInput.value = savedBgColor;
            document.body.style.backgroundColor = savedBgColor;
        }

        bgColorInput.addEventListener('change', function() {
            const newColor = this.value;
            document.body.style.backgroundColor = newColor;
            localStorage.setItem('bgColor', newColor);
        });
    }
});


function generateUniqueId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}


function saveToStorage(key, data) {
    const existingData = getFromStorage(key) || [];
    existingData.push(data);
    localStorage.setItem(key, JSON.stringify(existingData));
}


function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}


function updateStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}


function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.className = 'error';
    }
}


function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.className = 'success';
    }
}


const TEXAS_CITIES = ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'];
const CALIFORNIA_CITIES = ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno'];
const ALL_CITIES = [...TEXAS_CITIES, ...CALIFORNIA_CITIES];