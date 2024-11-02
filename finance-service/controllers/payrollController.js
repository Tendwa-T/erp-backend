const { connectDB, disconnectDB } = require("../config/database");
const Payroll = require("../models/Payroll");

async function calculatePay(req, res) {
  const { employeeID, baseSalary, bonus, deductions } = req.body;

  try {
    await connectDB("finance");
    const payroll = new Payroll({
      employeeID,
      baseSalary,
      bonus,
      deductions,
    });

    await payroll.save();
    return res.status(201).json({
      data: payroll,
      message: "Payroll Calculated and Saved",
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

async function fetchEmployeePayroll(req, res) {
  try {
    await connectDB("finance");
    const payrollRecords = await Payroll.find({
      employeeID: req.params.employeeID,
    });
    if (!payrollRecords) {
      return res.status(200).json({
        data: {},
        message: "Success: No Records found",
        success: true,
      });
    }
    return res.status(200).json({
      data: payrollRecords,
      message: "Fetched Successfully",
      success: true,
    });
  } catch (err) {
    console.lof(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function approvePayroll(req, res) {
  try {
    await connectDB("finance");
    const payroll = await Payroll.findById(req.params.payrollID);
    if (!payroll) {
      return res.status(404).json({
        data: {},
        message: "Payroll Record Not Found",
        success: true,
      });
    }
    (payroll.status = "Paid"), await payroll.save();

    return res.status(200).json({
      data: payroll,
      message: "Payroll Approved",
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

async function generatePayslip(req, res) {
  try {
    await connectDB("finance");
    const payroll = await Payroll.findById(req.params.payrollID).populate(
      "employeeID",
    );
    if (!payroll)
      return res.status(404).json({
        data: {},
        message: "Payroll Record not found",
        success: false,
      });

    const payslip = {
      employeeName: payroll.employeeID.name,
      baseSalary: payroll.baseSalary,
      bonus: payroll.bonus,
      deductions: payroll.deductions,
      tax: payroll.tax,
      netPay: payroll.netPay,
      paymentDate: payroll.paymentDate,
    };

    return res
      .status(200)
      .json({ data: payslip, message: "Payslip Generated", success: true });
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

module.exports = {
  calculatePay,
  fetchEmployeePayroll,
  approvePayroll,
  generatePayslip,
};
