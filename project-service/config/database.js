require("dotenv").config();

const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
const connectDB = async (collName) => {
  try {
    const connection = await mongoose.connect(uri, {
      dbName: collName,
    });
    console.log(`Connected to MongoDB - Collection: ${collName}`);
    return connection;
  } catch (err) {
    console.error(`Error Connecting to ${collName}: `, err.message);
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
