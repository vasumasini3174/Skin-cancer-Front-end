// Add to your server.js or main backend file
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Vasu@3174',
    database: 'major_project_phase-1'
});

db.connect();

app.post('/register', (req, res) => {
    const { first_name, last_name, username, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
        return res.send('Password and Confirm Password do not match!');
    }
    const sql = 'INSERT INTO users (UserName,FirstName,LastName, Email,Password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [username, first_name, last_name, email, password], (err, result) => {
        if (err) {
            return res.send('Error registering user.');
        }
        res.send('Registration successful!');
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});