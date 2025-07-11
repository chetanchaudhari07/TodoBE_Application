const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

pp.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.options("*", cors());
app.use(express.json());

const Todo = require("./routes/todoRoutes");
const User = require("./routes/userRoutes");

app.use("/api/todos", Todo);
app.use("/api/users", User);

app.get("/", (req, res) => 
  res.send("Welcome to the Todo API"));

app.listen(PORT, () => {
    connectDB()
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.error("Failed to connect to MongoDB:", err)) ;
  console.log(`Server is running on http://localhost:${PORT}`);
});



