require("dotenv").config();

const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
const env = process.env.ENVIRONMENT;
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${uri}`, {
      dbName: env,
    });
    console.log(`Connected to MongoDB`);
    return connection;
  } catch (err) {
    console.error(`Error Connecting: `, err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (err) {
    console.error(`Error Disconnecting MongoDB`, err.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
