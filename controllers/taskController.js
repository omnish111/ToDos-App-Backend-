import Task from "../models/Task.js";

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length < 2) {
      res.status(400);
      throw new Error("Task title must be at least 2 characters");
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Task created",
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (typeof title !== "undefined") {
      if (!title || title.trim().length < 2) {
        res.status(400);
        throw new Error("Task title must be at least 2 characters");
      }
      task.title = title.trim();
    }

    if (typeof description !== "undefined") {
      task.description = description.trim();
    }

    if (typeof completed === "boolean") {
      task.completed = completed;
    }

    const updatedTask = await task.save();

    return res.json({
      success: true,
      message: "Task updated",
      data: updatedTask,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    return res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    return next(error);
  }
};

export { getTasks, createTask, updateTask, deleteTask };
