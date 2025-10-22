import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>Status: {task.completed ? "✅ Done" : "🕒 Pending"}</p>
    </div>
  );
};

export default TaskCard;
