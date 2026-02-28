const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
  },
  category: {
    type: String,
  },
  due_date: {
    type: Date,
  },
  completed_at: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
