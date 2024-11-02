const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const User = require("../../user-service/models/User");
const { connectDB, disconnectDB } = require("../config/database");

exports.addEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB("hr");
    const { name, email, phone, department, position, role, salary } = req.body;
    const userData = {
      name,
      email,
      password: "P@$$-Wad",
      department,
      role,
    };

    const empData = {
      name,
      email,
      phone,
      department,
      position,
      role,
      salary,
    };

    const user = new User(userData);
    await user.save({ session });

    const employee = new Employee({ ...empData, userID: user._id });
    await employee.save({ session });

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      data: { user, employee },
      message: "Employee Created with a User Account",
      success: true,
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    return res.status(500).json({
      data: {},
      message: `An Error Occured: ${err.message}`,
      success: false,
    });
  } finally {
    await disconnectDB();
  }
};

exports.getEmployees = async (req, res) => {
  try {
    await connectDB("hr");
    const employees = await Employee.find();
    return res
      .status(200)
      .json({ data: employees, message: `Employees Fetched`, success: true });
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
