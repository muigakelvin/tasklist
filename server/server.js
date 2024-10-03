const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import the db.js file
const app = express();
const Port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.get("/tasks", async (req, res) => {
  try {
    const client = await db.getClient(); // Get a client from the pool
    const result = await client.query("SELECT * FROM entries");
    client.release(); // Release the client back to the pool
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { name } = req.body;
    const client = await db.getClient();
    const result = await client.query(
      "INSERT INTO tasks(description) VALUES($1) RETURNING *",
      [name]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await db.getClient();
    await client.query("DELETE FROM tasks WHERE id=$1", [id]);
    client.release();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
