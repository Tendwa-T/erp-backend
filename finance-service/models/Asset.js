const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Vehicle", "Equipment", "Building", "Tool"],
    required: true,
  },
  acquisitionCost: { type: Number, required: true },
  depreciationRate: { type: Number, required: true },
  acquisitionDate: { type: Date, required: true },
  currentValue: { type: Number, required: true },
  assignedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

AssetSchema.methods.calculateCurrentValue = function () {
  const yearsElapsed =
    (Date.now() - this.acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  this.currentValue =
    this.acquisitionCost * Math.pow(1 - this.depreciationRate, yearsElapsed);
  return this.currentValue;
};

module.exports = mongoose.model("Asset", AssetSchema);
