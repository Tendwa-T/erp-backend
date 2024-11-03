const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    totalBudget: { type: Number, required: true },
    allocatedBudget: { type: Number, default: 0 },
    spentBudget: { type: Number, default: 0 },
  },
  milestones: [
    {
      name: { type: String, required: true },
      startDate: { type: Date },
      endDate: { type: Date },
      allocatedBudget: { type: Number, default: 0 }, // Budget for the milestone.
      spentAmount: { type: Number, default: 0 }, // Expenses incurred
    },
  ],
  assignedEmployees: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  ],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
});

module.exports = mongoose.model("Project", ProjectSchema);
