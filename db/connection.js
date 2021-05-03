const mysql = require('mysql2');
require('dotenv').config();

// connect to database
const db = mysql.createConnection({
    host: 'localhost',
    // Enter your mysql username
    user: process.env.DB_USER,
    // Enter your mysql password
    password: process.env.DB_PASSWORD,
    database: 'business'
});

module.exports = db;