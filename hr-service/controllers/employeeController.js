const dotenv = require("dotenv");
dotenv.config();
const Employee = require("../models/Employee");
const userService = process.env.USER_SERVICE_URL;

async function addEmployee(req, res) {
  try {
    const { name, email, phone, department, role, skills, salary } = req.body;

    // Handle the user First
    const defaultPass = `Pass-${email}`;
    const userData = {
      name,
      email,
      password: defaultPass,
      department,
      role,
    };
    const userRes = await fetch(`${userService}/users/`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });

    const user = await userRes.json();
    if (!user.success) {
      throw new Error(user.message);
    }

    // Handle Employee Next

    const empData = {
      userID: user.data._id,
      name,
      email,
      phone,
      department,
      role,
      skills,
      salary,
    };

    const employee = new Employee(empData);
    await employee.save();

    return res.status(200).json({
      data: { user, employee },
      message: "Employee Created with a User Account",
      success: true,
    });
  } catch (err) {
    console.log(err);
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
