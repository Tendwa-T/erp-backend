const { verifyToken } = require("../utils/jwtUtils");
const grpc = require("@grpc/grpc-js");

function authorize(allowedRoles) {
  return (call, callback, next) => {
    try {
      const metadata = call.metadata.get("authorization");
      if (!metadata.length) {
        console.log("error in 1");
        return callback({
          code: grpc.status.UNAUTHENTICATED,
          message: "Unauthorized: No token provided",
        });
      }
      const token = metadata[0].replace("Bearer ", "");
      const decoded = verifyToken(token, (err, decoded) => {
        console.log(decoded);
        if (err) {
          console.log("err in 2");
          return callback({
            code: grpc.status.UNAUTHENTICATED,
            message: "Unauthorized: " + err.message,
          });
        }
      });

      if (!allowedRoles.includes(decoded.role)) {
        console.log("err in 3");
        return callback({
          code: grpc.status.PERMISSION_DENIED,
          message: "Forbidden: You do not have the required permissions",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log("err in 4");
      return callback({
        code: grpc.status.INTERNAL,
        message: "Internal server error: " + error.message,
      });
    }
  };
}

module.exports = authorize;
