import React from "react";

const Sidebar = () => {
  return (
    <aside style={{ width: "200px", background: "#f3f3ff", padding: "20px" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>Dashboard</li>
        <li>Analytics</li>
        <li>Reports</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
