const { connectDB, disconnectDB } = require("../config/database");
const Asset = require("../models/Asset");

async function createAsset(req, res) {
  const { name, type, acquisitionCost, depreciationRate, acquisitionDate } =
    req.body;

  try {
    const asset = new Asset({
      name,
      type,
      acquisitionCost,
      depreciationRate,
      acquisitionDate,
      currentValue: acquisitionCost,
    });

    await asset.save();
    return res.status(201).json({
      data: asset,
      message: "Asset Added",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Errr Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function recalculateAssetValue(req, res) {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({
        data: {},
        message: "Asset not found",
        success: false,
      });
    }
    asset.calculateCurrentValue();
    await asset.save();
    return res.status(200).json({
      data: asset,
      message: "Value recalculated",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function assignAsset(req, res) {
  const { projectID } = req.body;
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { assignedProject: projectID },
      { new: true },
    );
    return res.status(200).json({
      data: asset,
      message: "Asset Assigned",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

module.exports = {
  createAsset,
  recalculateAssetValue,
  assignAsset,
};
