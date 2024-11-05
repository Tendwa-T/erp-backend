const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ data: {}, message: "User already Exists", success: false });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPass,
      role,
      department,
    });
    await user.save();

    return res.status(201).json({
      data: { name: user.name, email: user.email, role: user.role },
      message: "User Registered Successfully",
      success: true,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      data: {},
      message: `Error: ${err.message}`,
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, pass: password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ data: {}, message: "User does not exist", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(403)
        .json({ data: {}, message: "Invalid Credentials", success: false });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const userData = {
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
    if (user.passwordResetRequired) {
      return res.status(200).json({
        data: userData,
        message: `Password Reset Required`,
        resetRequired: true,
        userID: user._id,
        success: true,
      });
    }
    console.log(`User logged in: ${user.name}`);
    return res
      .status(200)
      .json({ data: userData, message: "Login Succesful", success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ data: {}, message: `Error: ${err.message}`, success: false });
  }
};

async function resetPassword(req, res) {
  try {
    const { userID, newPassword } = req.body;
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ data: {}, message: "User Not found", success: false });
    }
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;
    user.passwordResetRequired = false;

    await user.save();
    return res.status(200).json({
      data: {},
      message: "Password Reset Successfull",
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
  registerUser,
  loginUser,
  resetPassword,
};
