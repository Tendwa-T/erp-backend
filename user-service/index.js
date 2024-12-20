const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const { connectDB } = require("./config/database");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("User Service Online");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`User Service running on Port ${PORT}`));
