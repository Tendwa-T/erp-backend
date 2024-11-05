const Client = require("../models/Client");

async function createClient(req, res) {
  const { name, email, phone, address } = req.body;
  try {
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        data: existingClient,
        message: "Client Already Exists",
        success: true,
      });
    }

    const client = new Client({
      name,
      email,
      phone,
      address,
    });
    await client.save();
    return res.status(201).json({
      data: client,
      message: "Client Created",
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
async function getAllClients(req, res) {
  try {
    const clients = await Client.find().populate("projects invoices");
    return res.status(200).json({
      data: clients,
      message: "Clients Fetched Successfully",
      success: true,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function updateClientDetails(req, res) {
  try {
    const client = await Client.findById(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      data: client,
      message: "Client Updated",
      success: true,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

async function deleteClient(req, res) {
  try {
    await Client.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      data: {},
      message: "Client Deleted Successfully",
      success: true,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      data: {},
      message: `An Error Occurred: ${err.message}`,
      success: false,
    });
  }
}

module.exports = {
  createClient,
  getAllClients,
  updateClientDetails,
  deleteClient,
};
