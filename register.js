document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Register.js is loaded");
            var password = document.getElementById('password').value;
            var confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                alert('Password and Confirm Password do not match!');
                return;
            }
            alert('Registration successful!');
            window.location.href = 'login.html';
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        if (formData.get('password') !== formData.get('confirm_password')) {
            alert('Password and Confirm Password do not match!');
            return;
        }

        fetch('/register', {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data === 'Registration successful!') {
                window.location.href = '/login.html';
            }
        })
        .catch(err => {
            alert('Error registering user.');
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const usernameInput = form.querySelector('input[name="username"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const confirmPasswordInput = form.querySelector('input[name="confirm_password"]');
    const msgBox = document.getElementById('registerMsg');

    // Username availability check
    usernameInput.addEventListener('blur', function () {
        const username = usernameInput.value.trim();
        if (username.length > 0) {
            fetch('/check-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `username=${encodeURIComponent(username)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    msgBox.textContent = 'Username already exists, try another one.';
                    msgBox.style.color = 'red';
                } else {
                    msgBox.textContent = '';
                }
            });
        }
    });

    // Password strength validation
    function isStrongPassword(password) {
        // At least 8 chars, one uppercase, one number, one special char
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    }

    passwordInput.addEventListener('input', function () {
        const password = passwordInput.value;
        if (!isStrongPassword(password)) {
            msgBox.textContent = 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.';
            msgBox.style.color = 'red';
        } else {
            msgBox.textContent = '';
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Prevent submission if password is not strong
        if (!isStrongPassword(password)) {
            msgBox.textContent = 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.';
            msgBox.style.color = 'red';
            return; // Do NOT insert into database
        }

        if (password !== confirmPassword) {
            msgBox.textContent = 'Password and Confirm Password do not match!';
            msgBox.style.color = 'red';
            return;
        }

        // Check username again before submitting
        fetch('/check-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(usernameInput.value.trim())}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                msgBox.textContent = 'Username already exists, try another one.';
                msgBox.style.color = 'red';
                return; // Do NOT insert into database
            } else {
                // Only insert if all checks pass
                fetch('/register', {
                    method: 'POST',
                    body: new URLSearchParams(formData)
                })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    if (data === 'Registration successful!') {
                        window.location.href = '/login.html';
                    }
                })
                .catch(err => {
                    alert('Error registering user.');
                });
            }
        });
    });
});