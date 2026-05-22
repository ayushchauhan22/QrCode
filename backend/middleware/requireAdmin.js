import User from "../models/userSchema.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.user.role = user.role;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Authorization failed" });
  }
};
