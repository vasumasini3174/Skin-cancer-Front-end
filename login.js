document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const msgBox = document.getElementById('loginMsg');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = form.querySelector('input[name="username"]').value;
            const password = form.querySelector('input[name="password"]').value;

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Login successful!');
                    window.location.href = '/index.html';
                    localStorage.setItem('loggedInUsername', username); // Store username for profile access
                } else {
                    if (msgBox) {
                        msgBox.textContent = data.message;
                        msgBox.style.color = 'red';
                    } else {
                        alert(data.message);
                        if (data.message.includes('register')) {
                            window.location.href = '/register.html';
                        }
                    }
                }
            })
            .catch(err => {
                alert('Error logging in.');
            });
        });
    }
});