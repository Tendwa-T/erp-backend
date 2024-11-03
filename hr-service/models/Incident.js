const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  employeeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  projectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
});

module.exports = mongoose.model("Incident", IncidentSchema);
