const Attendance = require("../models/Attendance");
const { connectDB, disconnectDB } = require("../config/database");
const Employee = require("../models/Employee");
const Project = require("../../project-service/models/project");

exports.checkIn = async (req, res) => {
  try {
    await connectDB("hr");
    const { employeeID, checkIn, projectID } = req.body;

    const existingEmployee = await Employee.findById(employeeID);

    if (!existingEmployee) {
      return res.status(404).json({
        data: {},
        message: "Employee Doesn't exist",
        success: false,
      });
    }
    const project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({
        data: {},
        message: "Project Not Found",
        success: false,
      });
    }

    const existingRecord = await Attendance.findOne({
      employeeID,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    });

    if (existingRecord) {
      return res
        .status(200)
        .json({ data: {}, message: "Already Cheked In today", success: false });
    }
    const attendance = new Attendance({
      employeeID,
      checkIn: new Date(checkIn),
      projectID,
    });
    await attendance.save();
    return res.status(201).json({
      data: attendance,
      message: "Attendance Recorded",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
};

exports.checkOut = async (req, res) => {
  try {
    await connectDB("hr");
    const { employeeID, checkOut } = req.body;

    const attendance = await Attendance.findOne({
      employeeID,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ data: {}, message: "Check-in Record not found" });
    }

    attendance.checkOut = new Date(checkOut);
    await attendance.save();
    return res.status(200).json({
      data: attendance,
      message: "Attendance Saved",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
};

exports.getAttendance = async (req, res) => {
  try {
    await connectDB("hr");
    const { employeeID, startDate, endDate } = req.query;

    let filter = {};
    if (employeeID) {
      filter.employeeID = employeeID;
    }
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const records = await Attendance.find(filter).populate(
      "employeeID",
      "name email",
    );
    return res
      .status(200)
      .json({ data: records, message: "Attendance Fetched", success: false });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
};
