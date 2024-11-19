const express = require("express");
const {
  addEmployee,
  getEmployees,
  getEmployee,
} = require("../controllers/employeeController");
const authorize = require("../middleware/authrorize");
const router = express.Router();

router.post("/", authorize("admin"), addEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployee);

module.exports = router;
