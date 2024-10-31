const jwt = require("jsonwebtoken");

const authorize = (requiredRole) => (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ data: {}, message: "No token provided", success: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        data: {},
        message: `Not Authorized: ${err.message}`,
        success: false,
      });
    }
    console.log(decoded);
    req.user = decoded;

    if (decoded.role !== requiredRole && decoded.role !== "admin") {
      return res
        .status(403)
        .json({ data: {}, message: "Access Denied", success: false });
    }
    next();
  });
};

module.exports = authorize;
