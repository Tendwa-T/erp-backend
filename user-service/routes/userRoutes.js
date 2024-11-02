const express = require("express");
const { loginUser, resetPassword } = require("../controllers/userController");
const router = express.Router();

router.post("/login", loginUser);
router.post("/reset-pass", resetPassword);

module.exports = router;
