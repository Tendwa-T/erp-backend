const { connectDB, disconnectDB } = require("../config/database");
const Project = require("../models/project");

async function createProject(req, res) {
  const { name, description, budget, startDate, endDate } = req.body;
  try {
    const project = new Project({
      name,
      description,
      budget: {
        totalBudget: budget,
        allocatedBudget: 0,
        spentBudget: 0,
      },
      startDate,
      endDate,
    });

    await project.save();
    return res.status(201).json({
      data: project,
      message: "Project Created Successfully",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error: ${err.message}`,
      success: false,
    });
  }
}

async function getProjects(req, res) {
  try {
    const projects = await Project.find().populate(
      "assignedEmployees expenses",
    );
    if (!projects) {
      return res
        .status(200)
        .json({ data: projects, message: "No Projects", success: true });
    }
    return res.status(200).json({
      data: projects,
      message: "Projects Fetched",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function getProject(req, res) {
  const { id } = req.params;
  try {
    await connectDB();
    const project = await Project.findById(id).populate(
      "assignedEmployees expenses",
    );
    if (!project) {
      return res
        .status(404)
        .json({ data: project, message: "Project Not Found", success: false });
    }
    return res.status(200).json({
      data: project,
      message: "Project Fetched",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function updateProject(req, res) {
  const { id } = req.params;
  const { name, description, budget, startDate, endDate } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, "budget.totalBudget": budget, startDate, endDate },
      { new: true },
    );
    if (!project) {
      return res.status(404).json({
        data: {},
        message: "Project Not found",
        success: false,
      });
    }
    return res.status(200).json({
      data: project,
      message: "Project Updated",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({
        data: project,
        message: "Project Not Found",
        success: false,
      });
    }
    return res.status(200).json({
      data: {},
      message: "Project Deleted Successfully",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function assignEmployees(req, res) {
  const { id } = req.params;
  const { employeeIDs } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { assignedEmployees: { $each: employeeIDs } } },
      { new: true },
    ).populate("assignedEmployees");

    if (!project) {
      return res
        .status(404)
        .json({ data: {}, message: "Projec Not Found", success: false });
    }
    return res.status(200).json({
      data: project,
      message: "Employees Assigned Successfully",
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

async function addMilestone(req, res) {
  const { id } = req.params;
  const { milestone } = req.body;

  try {
    await connectDB();
    const project = await Project.findByIdAndUpdate(
      id,
      { $push: { milestones: milestone } }, //milestone should include name, startDate, endDate, allocatedBudget,
      { new: true },
    );

    if (!project) {
      return res.status(404).json({
        data: {},
        message: "Project Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      data: project,
      message: "Milestone Assigned",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occured: ${err.message}`,
      success: false,
    });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  assignEmployees,
  addMilestone,
};
