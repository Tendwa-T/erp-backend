const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const Employee = require("../models/Employee");
const authorize = require("../middleware/rbacGRPC");
const { connectDB, disconnectDB } = require("../config/database");
const { verifyToken } = require("../utils/jwtUtils");

const PROTO_PATH = "./protos/hr.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const hrProto = grpc.loadPackageDefinition(packageDefinition).hr;

async function addEmployee(call, callback) {
  try {
    await connectDB("hr");
    const { name, email, department, role } = call.request;
    await Employee.create({ name, email, department, role });
    callback(null, { message: "Employee Added Successfully" });
  } catch (err) {
    console.log(err.message);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    });
  }
}
const checkAccess = (call, callback) => {
  const metadata = call.metadata.get("authorization");
  const { required_role } = call.request;
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

  // Simulate RBAC check
  if (decoded.user_id === "1" && required_role === "Admin") {
    callback(null, { access_granted: true, message: "Access granted" });
  } else {
    callback(null, { access_granted: false, message: "Access denied" });
  }
};
async function getEmployeeByID(call, callback) {
  try {
    await connectDB("hr");
    const { employeeId } = call.request;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Employee not Found",
      });
    }

    callback(null, {
      employee_id: employeeId,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
    });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    });
  } finally {
    await disconnectDB();
  }
}

function startGrpcServer() {
  const server = new grpc.Server();

  server.addService(hrProto.HRService.service, {
    CheckAccess: checkAccess,
    AddEmployee: (call, callback) => {
      authorize(["admin"])(call, callback, () => addEmployee(call, callback));
    },
    GetEmployeeByID: getEmployeeByID,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("gRPC Server is running on Port 50051");
    },
  );
}

module.exports = startGrpcServer;
