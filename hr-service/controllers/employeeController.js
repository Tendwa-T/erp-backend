const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const userService = process.env.USER_SERVICE_URL;

async function addEmployee(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, phone, department, role, skills, salary } = req.body;
    console.log("Request Received");
    console.log(userService);

    // Handle the user First

    const hashedPass = await bcrypt.hash("P@$$-Wad", 10);
    const userData = {
      name,
      email,
      password: hashedPass,
      department,
      role,
    };
    const res = await fetch(`${userService}/users/create`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    console.log(res);

    const user = await res.json();

    // Handle Employee Next

    const empData = {
      name,
      email,
      phone,
      department,
      role,
      skills,
      salary,
    };
    const employee = new Employee({ ...empData, userID: user._id });
    await employee.save();

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
  }
}

async function getEmployees(req, res) {
  try {
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
  }
}

module.exports = {
  addEmployee,
  getEmployees,
};
