const validateExpenseInput = (req, res, next) => {
  const { amount, category, status } = req.body;

  if (!amount || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be greater than Zero", success: false });
  }
  if (
    category &&
    !["Travel", "Office Supplies", "Utilities", "Others"].includes(category)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid Category", success: false });
  }
  if (status && !["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid Status", success: false });
  }

  next();
};

const validateBudgetInput = (req, res, next) => {
  const { allocatedAmount, startDate, endDate } = req.body;
  if (allocatedAmount < 0) {
    return res.status(400).json({
      messge: "Allcated Amount must be greater than Zero",
    });
  }
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({
      message: "Start Date must be before the end date",
    });
  }
  next();
};

module.exports = { validateExpenseInput, validateBudgetInput };
