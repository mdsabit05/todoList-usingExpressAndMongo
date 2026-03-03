const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");

router.post("/", async (req, res) => {
  try {
    const { text, category, due_date } = req.body;
    
    if (!text || text.trim() === "") {
      return res.status(400).json(
       {
         message : "text is required"
       }
      )
    };
    if (!category || category.trim() === "") {
      return res.status(400).json(
       {
         message : "category is required"
       }
      )
    };
    const newTodo = new Todo({
      text,
      category,
      due_date,
      completed_at : null,
    });
    const savetodo = await newTodo.save();
    res.status(201).json(savetodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const { status , category} = req.query;

    let filter = {};

    // status filter
    if ( status === "pending"){
      filter.completed_at = { $eq: null } ;
    }
    if ( status === "completed"){
      filter.completed_at = { $ne: null};
    }

    // category filter 
    if ( category && category !== "all") {
      filter.category = category.toLowerCase();
    }

    const todos = await Todo.find(filter);
    res.status(200).json(todos);
    
  } catch (error) {
    res.status(500).json({
      message : error.message
    });
  };
});
//   const todos = await Todo.find();
//   res.json(todos);
// });
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
     if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
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
