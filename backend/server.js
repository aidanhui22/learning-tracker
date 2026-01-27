const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Learning Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/entries', async (req, res) => {
    const entry_date = req.body.entry_date;
    const learned = req.body.learned;
    const reinforced = req.body.reinforced;
    const tomorrow = req.body.tomorrow;

    const query = "INSERT INTO entries (entry_date, learned, reinforced, tomorrow) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [entry_date, learned, reinforced, tomorrow];

    try {
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(400).json(err);
    }
});

app.get('/api/entries', async (req, res) => {
    const query = "SELECT * FROM entries ORDER BY entry_date DESC";

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error: ", err.message);
        res.status(500).json(err);
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});