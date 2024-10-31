const express = require("express");
const {
  checkIn,
  checkOut,
  getAttendance,
} = require("../controllers/attendanceController");
const router = express.Router();

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.get("/", getAttendance);

module.exports = router;
