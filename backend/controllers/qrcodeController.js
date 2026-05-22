import qrcode from "qrcode";
import User from "../models/userSchema.js";

export const generateQR = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const qrCodeDataURL = await qrcode.toDataURL(userId);
    res.json({ qrCode: qrCodeDataURL });
  } catch (error) {
    res.status(500).json({ error: "QR generation failed" });
  }
};
