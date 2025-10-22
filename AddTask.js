import React, { useState } from "react";
import "./AddTask.css";

function AddTask() {
  const [task, setTask] = useState({
    name: "",
    status: "In Progress",
    deadline: "",
    time: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Task Added!\n\n${JSON.stringify(task, null, 2)}`);
    // Later you can save it to backend/localStorage here
  };

  return (
    <div className="add-task-page">
      <div className="add-task-card">
        <h2>Add New Task 📝</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Task Name"
            value={task.name}
            onChange={handleChange}
            required
          />
          <select name="status" value={task.status} onChange={handleChange}>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Paused</option>
          </select>
          <input
            type="date"
            name="deadline"
            value={task.deadline}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="time"
            placeholder="Estimated Time (e.g., 2h 30m)"
            value={task.time}
            onChange={handleChange}
          />

          <button type="submit">Add Task</button>
        </form>

        <button
          className="back-btn"
          onClick={() => window.location.href = "/dashboard"}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AddTask;
