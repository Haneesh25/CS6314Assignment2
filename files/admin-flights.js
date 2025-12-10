document.getElementById('uploadForm').addEventListener('submit', function(e){
    e.preventDefault();

    const file = document.getElementById('flightsFile').files[0];
    if (!file) {
        document.getElementById('uploadMessage').textContent = "Please select a JSON file";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e){
        const flightsData = e.target.result;

        fetch('admin-load-flights.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: flightsData
        })
        .then(res => res.text())
        .then(msg => {
            document.getElementById('uploadMessage').textContent = msg;
        })
        .catch(err => {
            console.error(err);
            document.getElementById('uploadMessage').textContent = "Error uploading flights";
        });
    };
    reader.readAsText(file);
});
