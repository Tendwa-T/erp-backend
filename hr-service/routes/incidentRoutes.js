const express = require("express");
const reportIncident = require("../controllers/incidentControllers");
const router = express.Router();

router.post("/report", reportIncident());

module.exports = router;
