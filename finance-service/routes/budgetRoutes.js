const express = require("express");
const { validateBudgetInput } = require("../services/validation");
const {
  createBudget,
  updateSpending,
  retrieveBudget,
  generateReport,
} = require("../controllers/budgetController");
const router = express.Router();

router.post("/", validateBudgetInput, createBudget);
router.put("/:budgetID/spend", updateSpending);
router.get("/", retrieveBudget);
router.get("/report", generateReport);

module.exports = router;
