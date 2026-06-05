const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const usersRouter = require('./routes/users');
const stockinRouter = require('./routes/stockin');
const stockoutRouter = require('./routes/stockout');
const reportRouter = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/api/users', usersRouter);
app.use('/api/stockin', stockinRouter);
app.use('/api/stockout', stockoutRouter);
app.use('/api/reports', reportRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SMS API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
