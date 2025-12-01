/*
++-------------------------------++
|| ======== SERVER 3000 ======== ||
++-------------------------------++

open the browser on http://localhost:3000/login.html
if the login is successful, you will be redirected to http://localhost:3000/dashboard.html

if you want to setup for a new company, you will be redirected to http://localhost:3000/setup.html
after the setup, you will receive your company ID and be able to login with the created user

If the login was successfull you will find yourself at: http://localhost:3000/dashboard.html
From there you can add more users to your company via the "Add User" button. 
From wich you will be redirected to http://localhost:3000/adduser.html

API Endpoints:
- GET  /api/test        - test database connection
- POST /api/login       - user login
- POST /api/setup       - initial setup for a new company
- POST /api/users       - create a new user for an existing company

*/

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config(); 

console.log("Starting server on port 3000...");

const app = express();
const PORT = 3000;

let pool;
(async () => {
    try {
        pool = mysql.createPool({
            host: 'localhost',
            port: process.env.MYSQL_PORT || 3307, 
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("Database pool created successfully.");
        const connection = await pool.getConnection();
        console.log("Successfully connected to the database!");
        const [rows] = await connection.query('SELECT 1');
        console.log("Test query result:", rows);
        connection.release();
    } catch (err) {
        console.error("Error while connecting to the database:", err);
    }
})();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', '..', 'frontend')));

app.get('/api/test', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        console.log("Connection acquired for /api/test endpoint");
        const [rows] = await connection.query('SELECT 1');
        console.log("Query result for /api/test:", rows);
        connection.release();
        res.json({ status: 'Database connected', data: rows });
    } catch (error) {
        console.error("Error in /api/test endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    console.log("POST /api/login received with body:", req.body);
    
    const { company, username, password } = req.body || {};
    if (!company || !username || !password) {
        console.log("Missing credentials");
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    try {
        const conn = await pool.getConnection();
        console.log(`Querying user: COMP_ID=${company}, USER_ABBR=${username}`);
        
        const [rows] = await conn.query(
            'SELECT USER_ID, USER_ABBR, USER_PASSWORD, USER_SURNAME, USER_FIRST_NAME, USER_ROLE FROM USERS WHERE COMP_ID = ? AND USER_ABBR = ? LIMIT 1',
            [company, username]
        );
        conn.release();

        if (!rows || rows.length === 0) {
            console.log("User not found");
            return res.status(401).json({ success: false, message: 'Invalid company or username' });
        }

        const user = rows[0];
        const stored = user.USER_PASSWORD || '';
        console.log(`User found: ${user.USER_FIRST_NAME} ${user.USER_SURNAME}`);

        let passwordMatches = false;
        if (typeof stored === 'string' && stored.startsWith('$2')) {
            passwordMatches = await bcrypt.compare(password, stored);
        } else {
            passwordMatches = stored === password;
        }

        if (!passwordMatches) {
            console.log("Password does not match");
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        console.log("Login successful");
        return res.json({ success: true, redirect: '/dashboard.html' });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

app.post('/api/setup', async (req, res) => {
    console.log("POST /api/setup received with body:", req.body);
    const { companyName, companyDesc, userAbbr, firstname, surname, role, password, passwordRepeat } = req.body || {};

    if (!companyName || !companyDesc || !userAbbr || !firstname || !surname || !role || !password || !passwordRepeat) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    if (password !== passwordRepeat) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    try {
        const conn = await pool.getConnection();

        // 1. Insert Company
        const [companyResult] = await conn.query(
            'INSERT INTO COMPANY (COMP_NAME, COMP_DESC) VALUES (?, ?)',
            [companyName, companyDesc]
        );
        const companyId = companyResult.insertId;
        console.log("Company created with ID:", companyId);

        // 2. Insert User (passwort im Klartext)
        const [userResult] = await conn.query(
            'INSERT INTO USERS (COMP_ID, USER_ABBR, USER_SURNAME, USER_FIRST_NAME, USER_ROLE, USER_PASSWORD) VALUES (?, ?, ?, ?, ?, ?)',
            [companyId, userAbbr, surname, firstname, role, password]
        );
        const userId = userResult.insertId;
        console.log("User created with ID:", userId);

        // 3. Update Company Owner
        await conn.query(
            'UPDATE COMPANY SET COMP_OWNER_ID = ? WHERE COMP_ID = ?',
            [userId, companyId]
        );
        console.log("Company owner updated");

        conn.release();
        return res.json({ success: true, message: 'Setup completed successfully', companyId, userId });
    } catch (err) {
        console.error('Setup error:', err);
        return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

// Create additional user for an existing company
app.post('/api/users', async (req, res) => {
    console.log("POST /api/users received with body:", req.body);
    const { companyId, role, firstname, surname, username, password } = req.body || {};

    if (!companyId || !role || !firstname || !surname || !username || !password) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    try {
        const conn = await pool.getConnection();

        const [result] = await conn.query(
            'INSERT INTO USERS (COMP_ID, USER_ABBR, USER_SURNAME, USER_FIRST_NAME, USER_ROLE, USER_PASSWORD) VALUES (?, ?, ?, ?, ?, ?)',
            [companyId, username, surname, firstname, role, password]
        );

        const userId = result.insertId;
        console.log("Additional user created with ID:", userId, "for company:", companyId);

        conn.release();
        return res.json({ success: true, message: 'User created successfully', userId });
    } catch (err) {
        console.error('Create user error:', err);
        return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});