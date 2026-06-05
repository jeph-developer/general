const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = `SELECT si.*, u.UserName FROM StockIn si JOIN Users u ON si.UserID = u.UserID`;
    let params = [];
    if (search) {
      query += ` WHERE si.ItemName LIKE ? OR si.SupplierName LIKE ? OR si.Description LIKE ?`;
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }
    query += ` ORDER BY si.StockInDate DESC`;
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get StockIn error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT si.*, u.UserName FROM StockIn si JOIN Users u ON si.UserID = u.UserID WHERE si.StockInID = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get StockIn ID error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { ItemName, Description, QuantityIn, SupplierName, StockInDate } = req.body;
    if (!ItemName || !QuantityIn || !StockInDate) {
      return res.status(400).json({ error: 'ItemName, QuantityIn, and StockInDate are required' });
    }
    const qty = parseInt(QuantityIn);
    const [prevTotal] = await pool.query('SELECT COALESCE(SUM(QuantityIn),0) AS total FROM StockIn WHERE ItemName = ?', [ItemName]);
    const totalQtyIn = parseInt(prevTotal[0].total) + qty;
    const [result] = await pool.query(
      'INSERT INTO StockIn (ItemName, Description, QuantityIn, TotalQuantityIn, SupplierName, StockInDate, UserID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ItemName, Description || '', qty, totalQtyIn, SupplierName || '', StockInDate, req.session.userId]
    );
    res.status(201).json({ message: 'StockIn record created', StockInID: result.insertId });
  } catch (err) {
    console.error('Create StockIn error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { ItemName, Description, QuantityIn, SupplierName, StockInDate } = req.body;
    const [result] = await pool.query(
      'UPDATE StockIn SET ItemName=?, Description=?, QuantityIn=?, SupplierName=?, StockInDate=? WHERE StockInID=?',
      [ItemName, Description, parseInt(QuantityIn), SupplierName, StockInDate, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'StockIn record updated' });
  } catch (err) {
    console.error('Update StockIn error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM StockIn WHERE StockInID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'StockIn record deleted' });
  } catch (err) {
    console.error('Delete StockIn error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
