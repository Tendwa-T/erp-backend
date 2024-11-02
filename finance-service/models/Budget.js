const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  allocatedAmount: {
    type: Number,
    default: 0,
  },
  spentAmount: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Completed", "Exceeded"],
    default: "Active",
  },
});

module.exports = mongoose.model("Budget", BudgetSchema);
