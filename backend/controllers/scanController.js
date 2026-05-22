import mongoose from "mongoose";
import Scan from "../models/scanSchema.js";
import User from "../models/userSchema.js";

export const recordScan = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      error: "Invalid QR code",
      status: "invalid",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        status: "invalid",
      });
    }

    if (user.isScanned) {
      return res.status(409).json({
        error: "User already scanned",
        status: "already_scanned",
        user: {
          name: user.name,
          email: user.email,
          isScanned: true,
        },
      });
    }

    user.isScanned = true;
    await user.save();
    await Scan.create({ userId });

    res.status(201).json({
      message: "Scan recorded",
      status: "success",
      user: {
        name: user.name,
        email: user.email,
        isScanned: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Scan failed", status: "invalid" });
  }
};
