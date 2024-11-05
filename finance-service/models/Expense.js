const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Transport", "Project", "Opertational", "Other"],
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  projectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  budgetID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
