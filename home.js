const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve home.html for root BEFORE static middleware
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Serve other static files but do NOT let express auto-serve index.html
app.use(express.static(__dirname, { index: false }));

// ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // safe unique filename: timestamp + original name
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

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
// Route to receive predict form and save into `patient` table
app.post('/predict', upload.single('image'), (req, res) => {
    const username = (req.body.username || '').trim();
    if (!username) {
        return res.status(400).json({ success: false, message: 'Not logged in. Please login first.', redirect: '/login.html' });
    }

    // Verify username exists in users table
    db.query('SELECT UserName FROM users WHERE UserName = ?', [username], (err, rows) => {
        if (err) {
            console.error('DB error checking user:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (!rows.length) {
            return res.status(400).json({ success: false, message: 'Username not found. Please register.', redirect: '/register.html' });
        }

        // Prepare fields
        const full_name = req.body.name || req.body.full_name || '';
        const age = req.body.age ? parseInt(req.body.age, 10) : null;
        // normalize values to match enum in DB
        const genderRaw = (req.body.gender || '').toString().toLowerCase();
        const gender = genderRaw === 'male' ? 'Male' : genderRaw === 'female' ? 'Female' : 'Other';

        const alcoholRaw = (req.body.alcoholic || req.body.alcohol_use || '').toString().toLowerCase();
        const alcohol_use = alcoholRaw === 'yes' ? 'Yes' : 'No';

        const smokerRaw = (req.body.smoker || req.body.smoking_addict || '').toString().toLowerCase();
        const smoking_addict = smokerRaw === 'yes' ? 'Yes' : 'No';

        // file handling
        let imagePath = null;
        if (req.file) {
            imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
        }

        const sql = `INSERT INTO patients
            (username, full_name, age, gender, alcohol_use, smoking_addict, lesion_image_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [username, full_name, age, gender, alcohol_use, smoking_addict, imagePath], (err2, result) => {
            if (err2) {
                console.error('DB insert error:', err2);
                return res.status(500).json({ success: false, message: 'Database insert error', error: err2.message });
            }
            res.json({ success: true, patient_id: result.insertId, image_path: imagePath });
        });
    });
});

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