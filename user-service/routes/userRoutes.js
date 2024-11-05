const express = require("express");
const {
  loginUser,
  resetPassword,
  registerUser,
} = require("../controllers/userController");
const router = express.Router();

router.post("/login", loginUser);
router.post("/reset-pass", resetPassword);
router.post("/", registerUser);

module.exports = router;
