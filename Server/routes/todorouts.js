const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");

router.post("/", async (req, res) => {
  try {
    const { text, category, due_date } = req.body;
    const newTodo = new Todo({
      text,
      category,
      due_date,
    });
    const savetodo = await newTodo.save();
    res.status(201).json(savetodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});
router.get("/:id", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body}, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});
module.exports = router;
