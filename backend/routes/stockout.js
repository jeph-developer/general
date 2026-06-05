const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = `SELECT so.*, u.UserName FROM StockOut so JOIN Users u ON so.UserID = u.UserID`;
    let params = [];
    if (search) {
      query += ` WHERE so.ItemName LIKE ?`;
      params = [`%${search}%`];
    }
    query += ` ORDER BY so.StockOutDate DESC`;
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get StockOut error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT so.*, u.UserName FROM StockOut so JOIN Users u ON so.UserID = u.UserID WHERE so.StockOutID = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get StockOut ID error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { ItemName, QuantityOut, StockOutDate } = req.body;
    if (!ItemName || !QuantityOut || !StockOutDate) {
      return res.status(400).json({ error: 'ItemName, QuantityOut, and StockOutDate are required' });
    }
    const qty = parseInt(QuantityOut);
    const [prevTotal] = await pool.query('SELECT COALESCE(SUM(QuantityOut),0) AS total FROM StockOut WHERE ItemName = ?', [ItemName]);
    const totalQtyOut = parseInt(prevTotal[0].total) + qty;
    const [result] = await pool.query(
      'INSERT INTO StockOut (ItemName, QuantityOut, TotalQuantityOut, StockOutDate, UserID) VALUES (?, ?, ?, ?, ?)',
      [ItemName, qty, totalQtyOut, StockOutDate, req.session.userId]
    );
    res.status(201).json({ message: 'StockOut record created', StockOutID: result.insertId });
  } catch (err) {
    console.error('Create StockOut error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { ItemName, QuantityOut, StockOutDate } = req.body;
    const [result] = await pool.query(
      'UPDATE StockOut SET ItemName=?, QuantityOut=?, StockOutDate=? WHERE StockOutID=?',
      [ItemName, parseInt(QuantityOut), StockOutDate, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'StockOut record updated' });
  } catch (err) {
    console.error('Update StockOut error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM StockOut WHERE StockOutID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'StockOut record deleted' });
  } catch (err) {
    console.error('Delete StockOut error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
