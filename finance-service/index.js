const express = require("express");
const dotenv = require("dotenv");
const payrollRoutes = require("./routes/payrollRoutes");
const expensesRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/finances", payrollRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Finance Service running on Port ${PORT}`));
