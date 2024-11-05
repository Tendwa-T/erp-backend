const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  projectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  clientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  paymentDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
