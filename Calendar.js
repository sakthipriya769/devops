import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const userId = localStorage.getItem("userId"); // assuming you store it at login

  // ✅ Fetch tasks for selected date
  const fetchTasks = async () => {
    try {
      const formattedDate = date.toDateString();
      const res = await axios.get(`/api/calendar/${userId}/${formattedDate}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [date]);

  // ✅ Add new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post("/api/calendar", {
        userId,
        date: date.toDateString(),
        text: newTask,
      });
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  // ✅ Toggle done
  const toggleDone = async (id) => {
    try {
      await axios.put(`/api/calendar/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task", err);
    }
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/calendar/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  return (
    <div className="calendar-container">
      <h2 className="page-title">📅 Smart Calendar</h2>
      <p className="subtitle">Manage your tasks & deadlines with backend sync.</p>

      <div className="calendar-box">
        <Calendar value={date} onChange={setDate} />
      </div>

      <div className="task-section">
        <h3 className="selected-date">Selected Date: {date.toDateString()}</h3>

        <div className="add-task-box">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks for this date yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className={task.done ? "done" : ""}>
                <span onClick={() => toggleDone(task._id)}>{task.text}</span>
                <button onClick={() => deleteTask(task._id)}>🗑️</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
