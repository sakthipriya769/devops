import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: Date, required: true }, // for calendar link
  },
  { timestamps: true }
);

// Virtual field for readable date
taskSchema.virtual("dateString").get(function () {
  return this.dueDate ? this.dueDate.toDateString() : null;
});

// ✅ Fix for OverwriteModelError (important when using nodemon)
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
