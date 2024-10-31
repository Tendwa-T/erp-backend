const express = require("express");
const authorize = require("../middleware/authrorize");
const {
  applyForLeave,
  getAllLeaveRequests,
  getIndividualLeave,
  respondToRequests,
  cancelLeaveRequest,
} = require("../controllers/leaveController");
const router = express.Router();

router.post("/apply", authorize("employee"), applyForLeave);
router.get("/", authorize("admin"), getAllLeaveRequests);
router.get("/my-leaves", authorize("employee"), getIndividualLeave);
router.patch("/:id", authorize("admin"), respondToRequests);
router.delete("/:id", authorize("employee"), cancelLeaveRequest);

module.exports = router;
