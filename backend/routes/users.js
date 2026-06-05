const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { UserName, Password } = req.body;
    if (!UserName || !Password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const [rows] = await pool.query('SELECT * FROM Users WHERE UserName = ?', [UserName]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const user = rows[0];
    if (Password !== user.Password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    req.session.userId = user.UserID;
    req.session.userName = user.UserName;
    res.json({ message: 'Login successful', user: { UserID: user.UserID, UserName: user.UserName } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { UserName, Password } = req.body;
    if (!UserName || !Password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (Password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters' });
    }
    const [existing] = await pool.query('SELECT * FROM Users WHERE UserName = ?', [UserName]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const [result] = await pool.query('INSERT INTO Users (UserName, Password) VALUES (?, ?)', [UserName, Password]);
    req.session.userId = result.insertId;
    req.session.userName = UserName;
    res.status(201).json({
      message: 'User registered successfully',
      user: { UserID: result.insertId, UserName }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ userId: req.session.userId, userName: req.session.userName });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
