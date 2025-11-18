document.addEventListener('DOMContentLoaded', function () {
    console.log("Predict.js is loaded");
    const form = document.getElementById('predictForm');
    const resultBox = document.getElementById('resultBox');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // ensure logged in username available
        const username = localStorage.getItem('loggedInUsername');
        if (!username) {
            alert('Please login first.');
            window.location.href = '/login.html';
            return;
        }

        // disable submit to avoid duplicate requests
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Predicting...';
        }

        const formData = new FormData(form);
        formData.append('username', username);

        try {
            const res = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data && data.success) {
                // clear form fields AFTER successful submit (visual "reload")
                form.reset();

                // populate result box below the form
                const name = formData.get('name') || formData.get('full_name') || '';
                const age = formData.get('age') || '';
                const gender = formData.get('gender') || '';
                const alcoholic = formData.get('alcoholic') || formData.get('alcohol_use') || '';
                const smoker = formData.get('smoker') || formData.get('smoking_addict') || '';
                const imageLink = data.image_path ? `<a href="${data.image_path}" target="_blank">View uploaded image</a>` : 'No image';

                resultBox.innerHTML = `
                    <h3>Prediction Result</h3>
                    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Age:</strong> ${escapeHtml(age)}</p>
                    <p><strong>Gender:</strong> ${escapeHtml(gender)}</p>
                    <p><strong>Alcoholic:</strong> ${escapeHtml(alcoholic)}</p>
                    <p><strong>Smoking Addict:</strong> ${escapeHtml(smoker)}</p>
                    <p><strong>Image:</strong> ${imageLink}</p>
                    <p style="color:#1565c0;"><strong>Prediction:</strong> (Sample) No signs of skin cancer detected. Please consult a doctor for a professional diagnosis.</p>
                `;
                resultBox.style.display = 'block';

                // scroll to result
                resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                alert(data.message || 'Error saving patient data');
                if (data && data.redirect) window.location.href = data.redirect;
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting prediction form');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Predict';
            }
        }
    });

    // small helper to avoid injecting raw HTML
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
});

