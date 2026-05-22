import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userSchema.js";

dotenv.config();

const SEED_COUNT = 60;
const SEED_PASSWORD = "12345678";

const generateRandomCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

async function seed() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
  let created = 0;
  let updated = 0;

  for (let i = 1; i <= SEED_COUNT; i++) {
    const email = `seed.user${i}@qrcode.test`;
    const code = generateRandomCode();

    const existing = await User.findOne({ email });
    if (existing) {
      existing.password = hashedPassword;
      existing.code = code;
      existing.role = existing.role || "user";
      existing.isScanned = existing.isScanned ?? false;
      await existing.save();
      updated++;
      continue;
    }

    await User.create({
      name: `Seed User ${i}`,
      email,
      password: hashedPassword,
      code,
      role: "user",
      isScanned: false,
    });
    created++;
  }

  console.log(`Seed complete: ${created} created, ${updated} updated.`);
  console.log(`Password for all seeded users: ${SEED_PASSWORD}`);
  console.log(`Each user has a unique random 6-digit code.`);
  console.log(`Emails: seed.user1@qrcode.test … seed.user${SEED_COUNT}@qrcode.test`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
