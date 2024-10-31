const express = require("express");
const {
  addEmployee,
  getEmployees,
} = require("../controllers/employeeController");
const router = express.Router();

router.post("/", addEmployee);
router.get("/", getEmployees);

module.exports = router;
