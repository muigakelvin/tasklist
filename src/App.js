// src/App.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const apiUrl = "http://localhost:5000/tasks"; // Adjust if needed

const App = () => {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div className="container">
      <h1>Task List</h1>
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
              <td>{task.sentence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
