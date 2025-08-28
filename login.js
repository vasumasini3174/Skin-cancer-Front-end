document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    console.log("Login.js is loaded");
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Login successful!');
            window.location.href = '/index.html';
        });
    }
});