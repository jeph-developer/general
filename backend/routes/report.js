const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/stock-status', async (req, res) => {
  try {
    const { date } = req.query;
    let dateFilter = '';
    let params = [];
    if (date) {
      dateFilter = ' AND (si.StockInDate <= ? OR si.StockInDate IS NULL) AND (so.StockOutDate <= ? OR so.StockOutDate IS NULL)';
      params = [date, date];
    }

    const query = `
      SELECT
        items.ItemName,
        COALESCE(SUM(si.QuantityIn), 0) AS TotalQuantityReceived,
        COALESCE(SUM(so.QuantityOut), 0) AS TotalQuantityIssued,
        COALESCE(SUM(si.QuantityIn), 0) - COALESCE(SUM(so.QuantityOut), 0) AS RemainingStock
      FROM (
        SELECT DISTINCT ItemName FROM StockIn
        UNION
        SELECT DISTINCT ItemName FROM StockOut
      ) items
      LEFT JOIN StockIn si ON items.ItemName = si.ItemName
      LEFT JOIN StockOut so ON items.ItemName = so.ItemName
      GROUP BY items.ItemName
      ORDER BY items.ItemName
    `;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Stock status report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
