const express = require("express");
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  assignEmployees,
  addMilestone,
} = require("../controllers/projectController");
const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.put("/:id/assign-employees", assignEmployees);
router.put("/:id/add-milestone", addMilestone);

module.exports = router;
