const Employee = require("../models/Employee");
const { connectDB, disconnectDB } = require("../config/database");

exports.addEmployee = async (req, res) => {
  try {
    await connectDB("hr");
    const employee = new Employee(req.body);
    await employee.save();
    return res
      .status(201)
      .json({ data: employee, message: "Employee Created", success: true });
  } catch (err) {
    console.log(err);
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
    return res
      .status(500)
      .json({
        data: {},
        message: `An Error Occurred: ${err.message}`,
        success: false,
      });
  } finally {
    await disconnectDB();
  }
};
