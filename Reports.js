import React from "react";
import "./dashboard.css"; // reuse same styles

function Reports() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    else if (hour < 17) return "Good afternoon";
    else return "Good evening";
  };

  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2 className="logo">Smart<span>Scheduler</span></h2>
        <nav>
          <ul>
            <li onClick={() => window.location.href = "/dashboard"}>🏠 Dashboard</li>
            <li>📄 Reports</li>
            <li onClick={() => window.location.href = "/profile"}>👤 Profile</li>
            <li onClick={() => window.location.href = "/calendar"}>🗓️ Calendar</li>
          </ul>
        </nav>
        <button className="logout" onClick={() => {
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
        }}>Logout</button>
      </aside>

      <main className="dashboard-content">
        <header>
          <h1>{getGreeting()}, <span>{user?.name || "User"}!</span> 👋</h1>
          <p>Here’s your performance report summary 📊</p>
        </header>

        <div className="tasks-card">
          <h2>Reports Overview</h2>
          <p>Coming soon: detailed task analytics, productivity graphs, and export options!</p>
        </div>
      </main>
    </div>
  );
}

export default Reports;
