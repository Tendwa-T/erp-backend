const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hrService = process.env.HR_SERVICE_URL;

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
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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
        .json({ data: {}, message: "Invalid Password", success: false });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const empReq = await fetch(`${hrService}/employees/${user._id}`);
    let userData = {};
    await empReq.json().then((data) => {
      return (userData = {
        userID: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        skills: data.data.skills,
        salary: data.data.salary,
        status: data.data.status,
        certifications: data.data.certifications,
        projects: data.data.assignedProjects,
        resetPassword: user.passwordResetRequired,
        token,
      });
    });

    if (user.passwordResetRequired) {
      return res.status(200).json({
        data: userData,
        message: `Password Reset Required`,
        success: true,
      });
    }

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
