const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Leave", LeaveSchema);
