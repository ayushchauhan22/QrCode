import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
});

const Scan = mongoose.model("Scan", scanSchema);
export default Scan;
