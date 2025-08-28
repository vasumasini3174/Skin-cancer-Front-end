document.addEventListener('DOMContentLoaded', function () {
    console.log("Predict.js is loaded");
    const form = document.getElementById('predictForm');
    const resultBox = document.getElementById('resultBox');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulate prediction result (replace with real logic as needed)
            const name = document.getElementById('name').value;
            const age = document.getElementById('age').value;
            const gender = document.getElementById('gender').value;
            const alcoholic = document.getElementById('alcoholic').value;
            const smoker = document.getElementById('smoker').value;

            // Example result message
            const resultMessage = `
                <h3>Prediction Result</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Age:</strong> ${age}</p>
                <p><strong>Gender:</strong> ${gender}</p>
                <p><strong>Alcoholic:</strong> ${alcoholic}</p>
                <p><strong>Smoking Addict:</strong> ${smoker}</p>
                <p style="color:#1565c0;"><strong>Prediction:</strong> (Sample) No signs of skin cancer detected. Please consult a doctor for a professional diagnosis.</p>
            `;

            resultBox.innerHTML = resultMessage;
            resultBox.style.display = 'block';
        });
    }
});