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
  bonus: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
  },
  netPay: {
    type: Number,
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
  this.netPay = this.baseSalary + this.bonus - this.deductions - this.tax;
  next();
});

module.exports = mongoose.model("Payroll", payrollSchema);
