
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MONGO_URI } = require("../constants");
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Server is connected".bgGreen);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Nomalum xatolik";
    console.error("MongoDB-ga ulanishda xatolik:", errorMessage);
    process.exit(1);
  }
};

module.exports = connectDB;
