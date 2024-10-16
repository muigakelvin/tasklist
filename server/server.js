const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import the db.js file
const app = express();
const Port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Define routes

// GET all tasks from the 'entries' table
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

// POST a new task (insert into 'entries' table)
app.post("/tasks", async (req, res) => {
  try {
    const { description } = req.body; // Expecting description in the body
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const client = await db.getClient();
    const result = await client.query(
      "INSERT INTO entries(description) VALUES($1) RETURNING *",
      [description] // Inserting description into the 'entries' table
    );
    client.release();
    res.status(201).json(result.rows[0]);
    console.log(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT (update) a task by ID
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the task ID from the request parameters
    const { description } = req.body; // Get the updated description from the request body

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const client = await db.getClient();
    const result = await client.query(
      "UPDATE entries SET description=$1 WHERE id=$2 RETURNING *",
      [description, id] // Update the description in the 'entries' table for the given ID
    );

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" }); // If no task was found, return 404
    }

    res.json(result.rows[0]); // Respond with the updated task
    console.log(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a task by ID
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await db.getClient();
    await client.query("DELETE FROM entries WHERE id=$1", [id]); // Deleting from 'entries'
    client.release();
    res.status(204).end(); // No content to send back
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
