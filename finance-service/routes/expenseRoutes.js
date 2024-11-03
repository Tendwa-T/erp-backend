const express = require("express");
const {
  recordExpense,
  retrieveExpenses,
  reviewExpense,
  generateReport,
} = require("../controllers/expenseController");
const { validateExpenseInput } = require("../services/validation");
const router = express.Router();

router.post("/", validateExpenseInput, recordExpense);
router.get("/", retrieveExpenses);
router.get("/report", generateReport);
router.put("/:expenseID/status", reviewExpense);

module.exports = router;
