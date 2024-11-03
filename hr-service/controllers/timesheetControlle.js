const { connectDB, disconnectDB } = require("../config/database");
const Timesheet = require("../models/Timesheet");

async function createTimesheet(employeeID, projectID, date, hoursWorked) {
  try {
    await connectDB("timesheet");
    const timesheet = new Timesheet({
      employeeID,
      projectID,
      date,
      hoursWorked,
    });

    await timesheet.save();
    return { data: timesheet, message: "Timesheet Saved", success: true };
  } catch (err) {
    console.log(err.message);
    return {
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    };
  } finally {
    await disconnectDB();
  }
}

module.exports = { createTimesheet };
