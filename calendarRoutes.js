import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// ✅ Get tasks for a specific user and date
router.get("/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;

  try {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: userId,
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// ✅ Add new task
router.post("/", async (req, res) => {
  const { userId, title, description, dueDate } = req.body;

  try {
    const task = new Task({
      user: userId,
      title,
      description,
      dueDate,
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error adding task", error: err.message });
  }
});

// ✅ Update task status
router.put("/:id/status", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.status = task.status === "Completed" ? "Pending" : "Completed";
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
});

// ✅ Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
});

export default router;
