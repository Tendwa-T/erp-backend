const Timesheet = require("../models/Timesheet");

async function createTimesheet(employeeID, projectID, date, hoursWorked) {
  try {
    const timesheet = new Timesheet({
      employeeID,
      projectID,
      date,
      hoursWorked,
    });

    console.log(timesheet);
    await timesheet.save();
    return { data: timesheet, message: "Timesheet Saved", success: true };
  } catch (err) {
    console.log(err.message);
    return {
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    };
  }
}

module.exports = { createTimesheet };
