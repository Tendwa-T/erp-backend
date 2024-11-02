const { connectDB, disconnectDB } = require("../config/database");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

async function recordExpense(req, res) {
  try {
    await connectDB("finance");
    const { amount, category, description, createdBy, department } = req.body;
    const budget = await Budget.findOne({
      department,
      category,
      status: "Active",
    });
    if (!budget) {
      return res.status(404).json({
        data: {},
        message: "No active Budget found for this department",
        success: false,
      });
    }
    const expense = new Expense({
      amount,
      category,
      description,
      createdBy,
      budgetID: budget._id,
    });

    await expense.save();

    budget.spentAmount += amount;
    if (budget.spentAmount > budget.allocatedAmount) {
      budget.status = "Exceeded";
    } else if (budget.spentAmount === budget.allocatedAmount) {
      budget.status = "Completed";
    }

    await budget.save();

    return res.status(201).json({
      data: expense,
      message: "Expense Recorded and Budget Updated",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
}

async function retrieveExpenses(req, res) {
  const { category, startDate, endDate, status } = req.query;
  let filter = {};

  if (category) {
    filter.category = category;
  }
  if (status) {
    filter.status = status;
  }
  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  try {
    await connectDB("finance");
    const expenses = await Expense.find(filter);
    return res.status(200).json({
      data: expenses,
      message: "Expenses Fetched",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
}

async function reviewExpense(req, res) {
  const { expenseID } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({
      data: {},
      message: "Invalid Status",
      success: false,
    });
  }
  try {
    await connectDB("finance");
    const expense = await Expense.findById(expenseID);
    if (!expense) {
      return res.status(404).json({
        data: {},
        messgae: "Expense not Found",
        success: false,
      });
    }

    const budget = await Budget.findById(expense.budgetID);
    if (!budget) {
      return res.status(404).json({
        data: {},
        message: "No Associated Budget",
        success: false,
      });
    }

    if (status === "Approved" && expense.status === "Pending") {
      budget.spentAmount += expense.amount;
      if (budget.spentAmount > budget.allocatedAmount) {
        budget.status = "Exceeded";
      } else if (budget.spentAmount === budget.allocatedAmount) {
        budget.status = "Completed";
      }
      await budget.save();
    }

    expense.status = status;
    await expense.save();

    return res.status(200).json({
      data: expense,
      message: `Expense ${status.toLowerCase()}`,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
}

async function generateReport(req, res) {
  const { category, startDate, endDate } = req.query;
  let match = {};

  if (category) {
    match.category = category;
  }
  if (startDate && endDate) {
    match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    await connectDB("finance");
    const report = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);
    return res.status(200).json({
      data: report,
      message: "Report Generated",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return (
      res,
      status(500).json({
        data: {},
        meesage: `An Error Occurred: ${err.message}`,
        success: false,
      })
    );
  } finally {
    await disconnectDB();
  }
}

module.exports = {
  recordExpense,
  retrieveExpenses,
  reviewExpense,
  generateReport,
};
