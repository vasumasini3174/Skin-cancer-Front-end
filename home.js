const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
    let filePath = '';
    let contentType = 'text/html';

    if (req.url === '/' || req.url === '/home.html') {
        filePath = path.join(__dirname, 'home.html');
    } else if (req.url === '/home.css') {
        filePath = path.join(__dirname, 'home.css');
        contentType = 'text/css';
    } else if (req.url === '/login.html') {
        filePath = path.join(__dirname, 'login.html');
    } else if (req.url === '/login.css') {
        filePath = path.join(__dirname, 'login.css');
        contentType = 'text/css';
    } else if (req.url === '/login.js') {
        filePath = path.join(__dirname, 'login.js');
        contentType = 'application/javascript';
    } else if (req.url === '/register.html') {
        filePath = path.join(__dirname, 'register.html');
    } else if (req.url === '/register.css') {
        filePath = path.join(__dirname, 'register.css');
        contentType = 'text/css';
    } else if (req.url === '/register.js') {
        filePath = path.join(__dirname, 'register.js');
        contentType = 'application/javascript';
    } else if (req.url === '/index.html') {
        filePath = path.join(__dirname, 'index.html');
    } else if (req.url === '/index.css') {
        filePath = path.join(__dirname, 'index.css');
        contentType = 'text/css';
    } else if (req.url === '/predict.html') {
        filePath = path.join(__dirname, 'predict.html');
    } else if (req.url === '/predict.css') {
        filePath = path.join(__dirname, 'predict.css');
        contentType = 'text/css';
    } else if (req.url === '/predict.js') {
        filePath = path.join(__dirname, 'predict.js');
        contentType = 'application/javascript';
    } else if (req.url === '/profile.html') {
        filePath = path.join(__dirname, 'profile.html');
    } else if (req.url === '/profile.css') {
        filePath = path.join(__dirname, 'profile.css');
        contentType = 'text/css';
    } else if (req.url === '/logo.png') {
        filePath = path.join(__dirname, 'logo.png');
        contentType = 'image/png';
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Visit http://localhost:${port} to access the server`);
});