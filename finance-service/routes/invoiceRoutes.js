const express = require("express");
const {
  createInvoice,
  updatePayment,
  getAllInvoices,
} = require("../controllers/invoiceController");
const router = express.Router();

router.post("/", createInvoice);
router.put("/:id/pay", updatePayment);
router.get("/", getAllInvoices);

module.exports = router;
