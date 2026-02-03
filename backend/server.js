const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Learning Tracker API is running",
    timestamp: new Date().toISOString(),
  });
});

// Adds entry to database
app.post("/api/entries", async (req, res) => {
  const entry_date = req.body.entry_date;
  const learned = req.body.learned;
  const reinforced = req.body.reinforced;
  const tomorrow = req.body.tomorrow;

  const query =
    "INSERT INTO entries (entry_date, learned, reinforced, tomorrow) VALUES ($1, $2, $3, $4) RETURNING *";
  const values = [entry_date, learned, reinforced, tomorrow];

  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    const response = handlePostgresError(err);
    res.status(response.status).json(response);
  }
});

// Gets all entries from database, returned in JSON
app.get("/api/entries", async (req, res) => {
  const query = "SELECT * FROM entries ORDER BY entry_date DESC";

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error: ", err.message);
    res.status(500).json(err);
  }
});

// Returns current streak
app.get("/api/entries/streak", async (req, res) => {
  const query = "SELECT entry_date::TEXT FROM entries ORDER BY entry_date DESC";

  try {
    const result = await pool.query(query);
    let count = 0;
    let lastDate;
    for (const row of result.rows) {
      let currentDate = row.entry_date;
      if (lastDate && calculateDays(currentDate, lastDate) > 1) {
        break;
      }
      count++;
      lastDate = currentDate;
    }
    res.status(200).json(count);
  } catch (err) {
    console.error("Error: ", err.message);
    res.status(500).json(err);
  }
});

// Helper for streak endpoint
const calculateDays = (startDate, endDate) => {
  let start = new Date(startDate);
  let end = new Date(endDate);

  let timeDiff = end - start;
  let daysDiff = timeDiff / (1000 * 3600 * 24);

  return daysDiff;
};

// Edits an entry by ID
app.patch("/api/entries/:id", async (req, res) => {
  const id = req.params.id;
  const query =
    "UPDATE entries SET learned = $1, reinforced = $2, tomorrow = $3 WHERE id = $4";
  const learned = req.body.learned;
  const reinforced = req.body.reinforced;
  const tomorrow = req.body.tomorrow;
  const values = [learned, reinforced, tomorrow, id];

  try {
    const result = await pool.query(query, values);
    res.status(200).json({ message: "Entry successfully changed" });
  } catch (err) {
    console.error("Error: ", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Deletes an entry by ID
app.delete("/api/entries/:id", async (req, res) => {
  const id = req.params.id;
  const values = [id];
  const query = "DELETE FROM entries WHERE id = $1";

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).send("Entry does not exist");
    }
    res.status(200).json({ message: "Entry deleted successfully" });
    console.log("Successfully deleted entry");
  } catch (err) {
    console.error("Error: ", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

const handlePostgresError = (err) => {
  switch (err.code) {
    case "23505":
      return { status: 400, error: "Entry already exists for this date" };
    default:
      return { status: 500, error: "Internal error" };
  }
};
