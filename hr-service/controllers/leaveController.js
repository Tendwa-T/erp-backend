const { connectDB, disconnectDB } = require("../config/database");
const Leave = require("../models/Leave");

async function applyForLeave(req, res) {
  try {
    await connectDB("hr");
    const { startDate, endDate, reason } = req.body;
    const employeeID = req.user.userId;

    const leave = new Leave({ employeeID, startDate, endDate, reason });
    await leave.save();

    return res
      .status(201)
      .json({ data: leave, message: "Leave Request Submitted", success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
}

async function getIndividualLeave(req, res) {
  try {
    await connectDB("hr");
    const leaves = await Leave.find({ employeeID: req.user.userId });
    return res
      .status(200)
      .json({ data: leaves, message: "Leaves Fetched", success: true });
  } catch (err) {
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
}

async function getAllLeaveRequests(req, res) {
  try {
    await connectDB("hr");
    const leaves = await Leave.find().populate("employeeID", "name department");
    return res.status(200).json({
      data: leaves,
      message: "Leave Requests Fetched",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
}

async function respondToRequests(req, res) {
  try {
    await connectDB("hr");
    const { status } = req.body;
    const { leaveID } = req.params.id;
    if (!["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ data: {}, message: "Invalid Status", success: false });
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveID,
      { status },
      { new: true },
    );
    if (!leave) {
      return res
        .status(404)
        .json({ data: {}, message: "Leave Request not Found", success: false });
    }

    return res.status(200).json({
      data: {},
      message: `Leave ${status.toLowerCase()} successfully`,
      success: false,
    });
  } catch (err) {
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
}

async function cancelLeaveRequest(req, res) {
  try {
    await connectDB("hr");
    const leave = await Leave.findOneAndDelete({
      _id: req.params.id,
      employeeID: req.user.id,
    });
    if (!leave) {
      return res
        .status(404)
        .json({ data: {}, message: "Leave Request not found", success: false });
    }
    return res.status(200).json({
      data: {},
      message: "Leave Request Canceled Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
}

module.exports = {
  applyForLeave,
  cancelLeaveRequest,
  respondToRequests,
  getAllLeaveRequests,
  getIndividualLeave,
};
