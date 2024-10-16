import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap icons
import "./App.css";

const apiUrl = "http://localhost:5000/tasks"; // Adjust if needed

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(""); // State to hold the new task description
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered tasks
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State to track visibility of search bar
  const [editTaskId, setEditTaskId] = useState(null); // State to track which task is being edited
  const [editDescription, setEditDescription] = useState(""); // State to hold the edited task description

  // Status options and their corresponding colors
  const statusOptions = [
    { label: "Incomplete", value: "Incomplete", color: "lightgrey" },
    { label: "In progress", value: "In progress", color: "yellow" },
    { label: "Complete", value: "Complete", color: "green" },
    { label: "Blocked", value: "Blocked", color: "red" },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Filter tasks whenever the search query changes
    if (searchQuery.trim()) {
      const filtered = tasks.filter((task) =>
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [searchQuery, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTasks(response.data);
      setFilteredTasks(response.data); // Initially, show all tasks
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

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${apiUrl}/${id}`, {
        description: tasks.find((task) => task.id === id).description,
        status: newStatus,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        setTasks(tasks.filter((task) => task.id !== id)); // Remove the task from state
        setFilteredTasks(filteredTasks.filter((task) => task.id !== id)); // Update filtered tasks as well
        console.log("Task deleted:", id);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  // Handle task editing
  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditDescription(task.description);
  };

  // Save changes to task
  const saveChanges = async () => {
    if (!editDescription.trim()) {
      alert("Please enter a task description");
      return;
    }

    try {
      await axios.put(`${apiUrl}/${editTaskId}`, {
        description: editDescription,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId
            ? { ...task, description: editDescription }
            : task
        )
      );
      setFilteredTasks((prevFilteredTasks) =>
        prevFilteredTasks.map((task) =>
          task.id === editTaskId
            ? { ...task, description: editDescription }
            : task
        )
      );
      console.log("Task updated:", editTaskId);
      setEditTaskId(null); // Close the edit modal
      setEditDescription(""); // Clear the edit description
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredTasks(tasks); // Reset filtered tasks to show all
  };

  // Toggle the search bar visibility
  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
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

      {/* Search icon */}
      <div className="search-icon" onClick={toggleSearchBar}>
        <i
          className="bi bi-search"
          style={{ fontSize: "24px", cursor: "pointer" }}
        ></i>
      </div>

      {/* Conditionally render the search bar */}
      {isSearchVisible && (
        <div className="search-task">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={clearSearch}>Clear</button>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTaskId && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
            />
            <div className="modal-buttons">
              <button
                onClick={saveChanges}
                style={{
                  backgroundColor: "lightgreen",
                  cursor: "pointer",
                  padding: "10px",
                  border: "none",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4CAF50")
                } // Darker green on hover
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "lightgreen")
                } // Return to light green
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditTaskId(null);
                  setEditDescription("");
                }}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "lightcoral",
                  cursor: "pointer",
                  padding: "10px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.date}</td>{" "}
              {/* Assuming date is part of the task object */}
              <td>{task.description}</td>
              <td>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  style={{
                    backgroundColor: statusOptions.find(
                      (option) => option.value === task.status
                    )?.color,
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <i
                  className="bi bi-pencil-square"
                  onClick={() => handleEditTask(task)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                ></i>
                <i
                  className="bi bi-trash"
                  onClick={() => handleDeleteTask(task.id)}
                  style={{ cursor: "pointer" }}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
