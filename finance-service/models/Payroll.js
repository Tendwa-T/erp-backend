const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  overtimeHours: {
    type: Number,
    default: 0,
  },
  overtimeRate: {
    type: Number,
    default: 1.5,
  },
  tax: {
    type: Number,
    required: true,
  },
  finalSalary: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
});

payrollSchema.pre("save", function (next) {
  this.tax = this.baseSalary * 0.16;
  this.finalSalary =
    this.baseSalary + this.allowances - this.deductions - this.tax;
  next();
});

module.exports = mongoose.model("Payroll", payrollSchema);
