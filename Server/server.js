const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const todoRoutes = require("./routes/todorouts");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});
