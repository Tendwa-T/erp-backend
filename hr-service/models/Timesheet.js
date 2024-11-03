const mongoose = require("mongoose");

const TimesheetSchema = new mongoose.Schema({
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  projectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  hoursWorked: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Timesheet", TimesheetSchema);
