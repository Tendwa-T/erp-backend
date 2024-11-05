const Budget = require("../models/Budget");

async function createBudget(req, res) {
  const { department, category, allocatedAmount, startDate, endDate } =
    req.body;
  try {
    const budget = new Budget({
      department,
      category,
      allocatedAmount,
      startDate,
      endDate,
    });
    await budget.save();
    return res.status(201).json({
      data: budget,
      message: "Budget Created",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function updateSpending(req, res) {
  const { amount } = req.body;
  try {
    const budget = await Budget.findById(req.params.budgetID);
    if (!budget)
      return res
        .status(404)
        .json({ data: {}, message: "Budget Not found", success: false });

    budget.spentAmount += amount;
    if (budget.spentAmount > budget.allocatedAmount) {
      budget.status = "Exceeded";
    } else if (budget.spentAmount === budget.allocatedAmount) {
      budget.status = "Completed";
    }
    await budget.save();

    return res
      .status(200)
      .json({ data: budget, message: "Budget Updated", success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function retrieveBudget(req, res) {
  const { department, category, startDate, endDate } = req.query;
  let filter = {};

  if (department) {
    filter.department = department;
  }
  if (category) {
    filter.category = category;
  }
  if (startDate && endDate) {
    filter.startDate = { $gte: new Date(startDate) };
    filter.endDate = { $lte: new Date(endDate) };
  }
  try {
    const budgets = await Budget.find(filter);
    if (!budgets) {
      return res.status(200).json({
        data: budgets,
        message: "No Budget Record found",
        success: false,
      });
    }
    return res.status(200).json({
      data: budgets,
      message: "Budgets Fetched",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function generateReport(req, res) {
  try {
    const report = await Budget.aggregate([
      {
        $group: {
          _id: "$department",
          totalAllocated: { $sum: "$allocatedAmount" },
          totalSpent: { $sum: "$spentAmount" },
          budgetCount: { $sum: 1 },
        },
      },
      { $sort: { totalAllocated: -1 } },
    ]);
    return res.status(200).json({
      data: report,
      message: "Report Generated",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

module.exports = {
  createBudget,
  updateSpending,
  retrieveBudget,
  generateReport,
};
