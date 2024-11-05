const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const { connectDB } = require("./config/database");
/* const startGrpcServer = require("./services/hrGrpcService"); */
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`HR Service running on ${PORT}`);
});
