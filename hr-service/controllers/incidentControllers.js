const Incident = require("../models/Incident");

async function reportIncident(req, res) {
  const { employeeID, projectID, description, severity } = req.body;

  try {
    const incident = new Incident({
      employeeID,
      projectID,
      description,
      severity,
    });

    await incident.save();
    return res.status(200).json({
      data: incident,
      message: "Incident Reported Successfully",
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error occurred`,
      success: false,
    });
  }
}

module.exports = reportIncident;
