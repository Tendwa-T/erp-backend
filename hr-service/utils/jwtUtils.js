const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign({ userID: user._id, role: user.role }, SECRET, {
    expiresIn: "1h",
  });
}

function verifyToken(token) {
  try {
    const dec = jwt.verify(token, SECRET);
    return dec;
  } catch (err) {
    console.log(err.message);
    throw new Error("Invalid or Expired Token");
  }
}

module.exports = { generateToken, verifyToken };
