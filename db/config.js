require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  console.log("⏳ Trying to connect to MongoDB...");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log(" MongoDB Atlas is connected");
  } catch (err) {
    console.error(" MongoDB Atlas is NOT connected:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
