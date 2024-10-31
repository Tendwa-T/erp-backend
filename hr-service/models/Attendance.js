const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema({
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
