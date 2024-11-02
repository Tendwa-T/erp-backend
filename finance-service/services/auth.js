const authMiddleware = (req, res, next) => {
  const userRole = req.user.role;
  if (!["Admin", "Manager", "HR"].includes(userRole)) {
    return res.status(403).json({
      data: {},
      message: "Access Denied",
      success: false,
    });
  }
  next();
};

module.exports = authMiddleware;
