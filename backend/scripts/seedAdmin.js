const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/QRAppDB";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists:", adminExists.email);
      return;
    }

    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("adminpassword", 10),
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created:", adminUser.email);
  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
