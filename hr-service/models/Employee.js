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
  skills: [{ type: String }],
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
  salary: { type: Number, required: true },
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
  assignedProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  certifications: [
    {
      type: String,
      expiryDate: Date,
    },
  ],
});

module.exports = mongoose.model("Employee", employeeSchema);
