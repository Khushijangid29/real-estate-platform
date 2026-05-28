const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Database Connection
pool.getConnection().then(conn => {
    console.log('✅ Database connected successfully');
    conn.release();
}).catch(err => {
    console.error('❌ Database connection failed:', err.message);
});

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userType = decoded.userType;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ============= TEST ROUTE =============
app.get('/', (req, res) => {
    res.json({ message: '🏠 Real Estate Platform API is running!' });
});

// ============= AUTH ROUTES =============
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone, userType } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const conn = await pool.getConnection();
        
        await conn.execute(
            'INSERT INTO users (name, email, password, phone, user_type) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, userType || 'buyer']
        );
        
        conn.release();
        res.json({ message: '✅ Registration successful' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    try {
        const conn = await pool.getConnection();
        const [users] = await conn.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            conn.release();
            return res.status(401).json({ error: 'User not found' });
        }
        
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            conn.release();
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, userType: user.user_type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
        
        conn.release();
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: user.user_type
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============= START SERVER =============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
