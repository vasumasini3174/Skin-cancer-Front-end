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
            window.location.href = 'index.html';
});