const Invoice = require("../models/Invoice");

async function createInvoice(req, res) {
  const { projectID, clientID, amount, dueDate } = req.body;
  try {
    const invoice = new Invoice({ projectID, clientID, amount, dueDate });
    await invoice.save();
    return res.status(200).json({
      data: invoice,
      message: "Invoice Created",
      success: true,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      data: {},
      message: `An error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function updatePayment(req, res) {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findOneAndUpdate(
      req.params.id,
      { status: status, paymentDate: Date.now() },
      { new: true },
    );
    return res.status(200).json({
      data: invoice,
      message: `Invoice Updated: ${status}`,
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

async function getAllInvoices(req, res) {
  try {
    const invoices = await Invoice.find().populate("projectID clientID");
    return res.status(200).json({
      data: invoices,
      message: "Invoices Fetched",
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
  createInvoice,
  updatePayment,
  getAllInvoices,
};
