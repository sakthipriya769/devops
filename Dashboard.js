import React, { useState } from "react";
import "./dashboard.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  // 🕒 Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // 📝 Task state
  const [tasks, setTasks] = useState([
    { name: "Presentation meeting", status: "In Progress", deadline: "Aug 30", time: "1h 22m" },
    { name: "Prepare slides", status: "Completed", deadline: "Aug 29", time: "3h 35m" },
    { name: "Project research", status: "Paused", deadline: "Aug 27", time: "1h 54m" },
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    status: "Pending",
    deadline: "",
    time: "",
  });

  const data = [
    { name: "Completed", value: tasks.filter(t => t.status === "Completed").length },
    { name: "In Progress", value: tasks.filter(t => t.status === "In Progress").length },
    { name: "Pending", value: tasks.filter(t => t.status !== "Completed" && t.status !== "In Progress").length },
  ];

  const COLORS = ["#7E57C2", "#9575CD", "#D1C4E9"];

  // ✅ Add new task function
  const handleAddTask = () => {
    if (!newTask.name.trim() || !newTask.deadline.trim() || !newTask.time.trim()) {
      alert("Please fill in all fields before adding a task.");
      return;
    }

    setTasks((prev) => [...prev, newTask]);
    setNewTask({ name: "", status: "Pending", deadline: "", time: "" });
    setModalIsOpen(false);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          Smart<span>Scheduler</span>
        </h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/dashboard")}>🏠 Dashboard</li>
            <li onClick={() => navigate("/reports")}>📄 Reports</li>
            <li onClick={() => navigate("/profile")}>👤 Profile</li>
            <li onClick={() => navigate("/calendar")}>🗓️ Calendar</li>
          </ul>
        </nav>

        {/* Add Task Button */}
        <button className="add-task-sidebar" onClick={() => setModalIsOpen(true)}>
          + Add Task
        </button>

        {/* Logout */}
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("userInfo");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header>
          <h1>
            {getGreeting()}, <span>{user?.name || "User"}!</span> 👋
          </h1>
          <p>Stay organized and boost your productivity effortlessly.</p>
        </header>

        {/* Top Cards */}
        <div className="top-cards">
          <div className="card">
            📊 Analytics
            <br />
            <span>Analyzing your data</span>
          </div>
          <div className="card">
            📑 Reports
            <br />
            <span>Generate activity report</span>
          </div>
        </div>

        {/* Middle Section */}
        <div className="middle-section">
          <div className="tasks-card">
            <h2>My Tasks</h2>
            {tasks.length === 0 ? (
              <p className="no-tasks">No tasks yet. Click “+ Add Task” to create one!</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, i) => (
                    <tr key={i}>
                      <td>{task.name}</td>
                      <td>
                        <span
                          className={`status ${task.status.toLowerCase().replace(" ", "-")}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>{task.deadline}</td>
                      <td>{task.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="chart-card">
            <h2>Task Progress Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* ✅ Add Task Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Task</h2>

        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />

        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="text"
          placeholder="Deadline (e.g. Oct 20)"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />
        <input
          type="text"
          placeholder="Estimated Time (e.g. 2h 30m)"
          value={newTask.time}
          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
        />

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleAddTask}>
            ✅ Add Task
          </button>
          <button className="cancel-btn" onClick={() => setModalIsOpen(false)}>
            ❌ Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
