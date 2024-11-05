const express = require("express");
const dotenv = require("dotenv");
const payrollRoutes = require("./routes/payrollRoutes");
const expensesRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const clientRoutes = require("./routes/clientRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const assetRoutes = require("./routes/assetRoutes");
const cors = require("cors");
const { connectDB } = require("./config/database");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/pay", payrollRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/assets", assetRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Finance Service running on Port ${PORT}`));
