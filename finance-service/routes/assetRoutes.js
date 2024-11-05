const express = require("express");
const {
  createAsset,
  recalculateAssetValue,
  assignAsset,
} = require("../controllers/assetController");
const router = express.Router();

router.post("/", createAsset),
  router.put("/:id/recalculate", recalculateAssetValue);
router.put("/:id/assign", assignAsset);

module.exports = router;
