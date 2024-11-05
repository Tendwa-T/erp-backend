const express = require("express");
const {
  calculatePay,
  fetchEmployeePayroll,
  approvePayroll,
  generatePayslip,
  getAllPayrolls,
} = require("../controllers/payrollController");
const router = express.Router();

router.post("/calculate", calculatePay);
router.get("/employee/:employeeID", fetchEmployeePayroll);
router.put("/approve/:payrollID", approvePayroll);
router.get("/payslip/:payrollID", generatePayslip);
router.get("/employees/", getAllPayrolls);

module.exports = router;
