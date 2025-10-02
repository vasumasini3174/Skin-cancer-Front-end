document.addEventListener('DOMContentLoaded', function () {
    // Example: get username from localStorage (set after login)
    const username = localStorage.getItem('loggedInUsername');
    if (!username) {
        alert('Please login first.');
        window.location.href = '/login.html';
        return;
    }

    fetch(`/get-profile?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('profileUsername').textContent = data.user.username;
                document.getElementById('profileName').textContent = `${data.user.first_name} ${data.user.last_name}`;
                document.getElementById('profileEmail').textContent = data.user.email;
                document.getElementById('profileAge').textContent = data.user.age || '';
                document.getElementById('profileGender').textContent = data.user.gender || '';
            } else {
                alert('User not found.');
                window.location.href = '/login.html';
            }
        })
        .catch(() => {
            alert('Error fetching profile.');
        });
});