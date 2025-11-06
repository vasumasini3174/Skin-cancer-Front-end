const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname)); // Serve static files

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Vasu@3174',
    database: 'major_project_phase-1'
});

db.connect();

// Registration API
app.post('/register', (req, res) => {
    const { first_name, last_name, username, email, password, confirm_password, age, gender } = req.body;
    if (password !== confirm_password) {
        return res.send('Password and Confirm Password do not match!');
    }
    const sql = 'INSERT INTO users (UserName, FirstName, LastName, Email, Password, Age, Gender) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [username, first_name, last_name, email, password, age, gender], (err, result) => {
        if (err) {
            return res.send('Error registering user.');
        }
        res.send('Registration successful!');
    });
});
// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // First, check if the username exists
    const sqlUser = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlUser, [username], (err, results) => {
        if (err) return res.json({ success: false, message: 'Server error.' });
        if (results.length === 0) {
            // Username not found
            return res.json({ success: false, message: 'No account found. Please register.' });
        } else {
            // Username found, check password
            const sqlPass = 'SELECT * FROM users WHERE username = ? AND password = ?';
            db.query(sqlPass, [username, password], (err2, results2) => {
                if (err2) return res.json({ success: false, message: 'Server error.' });
                if (results2.length > 0) {
                    // Success
                    res.json({ success: true });
                } else {
                    // Password incorrect
                    res.json({ success: false, message: 'Password is incorrect. Try again.' });
                }
            });
        }
    });
});
//check username availability API
app.post('/check-username', (req, res) => {
    const { username } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.json({ exists: false });
        res.json({ exists: results.length > 0 });
    });
});
// Serve home.html as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.use(express.static(__dirname));
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// Profile API
// Add this route to your Express server (home.js or server.js)
app.get('/get-profile', (req, res) => {
    const username = req.query.username;
    db.query('SELECT * FROM users WHERE UserName = ?', [username], (err, results) => {
        if (err || results.length === 0) {
            return res.json({ success: false });
        }
        const user = results[0];
        res.json({
            success: true,
            user: {
                username: user.UserName, // Use the exact column name
                first_name: user.FirstName || '',
                last_name: user.LastName || '',
                email: user.Email || '',
                age: user.Age || '',
                gender: user.Gender || ''
            }
        });
    });
});