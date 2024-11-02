const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: { type: String },
  department: { type: String, required: true },
  position: { type: String },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
  salary: { type: Number },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hireDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
