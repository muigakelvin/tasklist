import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const apiUrl = "http://localhost:5000/tasks"; // Adjust if needed

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(""); // State to hold the new task description

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Function to add a new task
  const addTask = async () => {
    if (!newTask.trim()) {
      alert("Please enter a task description");
      return;
    }

    try {
      const response = await axios.post(apiUrl, { description: newTask });
      setTasks([...tasks, response.data]); // Add new task to the current tasks list
      setNewTask(""); // Clear the input field after adding
      console.log("New task added:", response.data);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="container">
      <h1>Task List</h1>

      {/* Input field and button to add a new task */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Enter task description"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
