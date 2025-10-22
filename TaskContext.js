import React, { createContext, useState } from "react";
import API from "../services/api";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data } = await API.get("/tasks");
    setTasks(data);
  };

  const addTask = async (task) => {
    const { data } = await API.post("/tasks", task);
    setTasks((prev) => [...prev, data]);
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};
