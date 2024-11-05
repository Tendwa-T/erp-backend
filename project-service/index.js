const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const projectRoutes = require("./routes/projectRoutes");
const { connectDB } = require("./config/database");
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Project Service online");
});
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Project Service running on ${PORT}`);
});
