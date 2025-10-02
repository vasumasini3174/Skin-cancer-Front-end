const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',       // from Workbench
  port: 3306,              // from Workbench
  user: 'root',            // from Workbench
  password: 'Vasu@3174', // from Workbench
  database: 'major_project_phase-1' // your schema
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connect error:', err);
    return;
  }
  console.log('Connected!');
});

module.exports = connection;
