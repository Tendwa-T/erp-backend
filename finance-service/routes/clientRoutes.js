const express = require("express");
const {
  createClient,
  getAllClients,
  updateClientDetails,
  deleteClient,
} = require("../controllers/clientController");
const router = express.Router();

router.post("/", createClient),
  router.get("/", getAllClients),
  router.put("/:id", updateClientDetails);
router.delete("/:id", deleteClient);

module.exports = router;
