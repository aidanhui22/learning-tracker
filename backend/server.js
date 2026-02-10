const express = require("express");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const saltRounds = 10;
// testing osxkeychain works
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

app.post("/auth/signup", async (req, res) => {
  const email = req.body.email;
  const password_hash = await bcrypt.hash(req.body.password, saltRounds);

  const query =
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *";
  const values = [email, password_hash];

  try {
    const result = await pool.query(query, values);
    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" },
    );
    console.log(token);
    res.status(200).json({ token });
  } catch (err) {
    const response = handlePostgresError(err);
    res.status(response.status).json(response);
  }
});

app.post("/auth/login", async (req, res) => {
  const email = req.body.email;
  const input_password = req.body.password;
  const locateUser = "SELECT * from users WHERE email = $1";

  try {
    const result = await pool.query(locateUser, [email]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Email does not exist!" });
    }

    const user = result.rows[0];
    const pass_success = await bcrypt.compare(
      input_password,
      user.password_hash,
    );
    if (!pass_success) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" },
    );
    console.log(token);
    return res.status(200).json({ token });
  } catch (err) {
    console.log("Full err ", err);
    console.log("Error mess ", err.message)
    console.log("Code: ", err.code);
    const response = handlePostgresError(err);
    res.status(response.status).json(response);
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Auth header ", authHeader);
  if (token == null) {
    return res.sendStatus(401);
  }

  try {
    const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = result;
    next();
  } catch (err) {
    console.log("JWT fail: ", err.message);
    return res.sendStatus(403);
  }
};

// Adds entry to database
app.post("/api/entries", authenticateToken, async (req, res) => {
  const entry_date = req.body.entry_date;
  const learned = req.body.learned;
  const reinforced = req.body.reinforced;
  const tomorrow = req.body.tomorrow;
  const user_id = req.user.userId;

  const query =
    "INSERT INTO entries (entry_date, learned, reinforced, tomorrow, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const values = [entry_date, learned, reinforced, tomorrow, user_id];

  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    const response = handlePostgresError(err);
    res.status(response.status).json(response);
  }
});

// Gets all entries from database, returned in JSON
app.get("/api/entries", authenticateToken, async (req, res) => {
  const query =
    "SELECT * FROM entries WHERE user_id = $1 ORDER BY entry_date DESC";

  try {
    const result = await pool.query(query, [req.user.userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error: ", err.message);
    res.status(500).json(err);
  }
});

// Returns current streak
app.get("/api/entries/streak", authenticateToken, async (req, res) => {
  const query = "SELECT entry_date::TEXT FROM entries WHERE user_id = $1 ORDER BY entry_date DESC";

  try {
    const result = await pool.query(query, [req.user.userId]);
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
app.patch("/api/entries/:id", authenticateToken, async (req, res) => {
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
app.delete("/api/entries/:id", authenticateToken, async (req, res) => {
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
