import express from "express";
import cors from "cors";
import qrcode from "qrcode";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToMongo from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import qrcodeRoutes from "./routes/qrcode.routes.js";
import scanRoutes from "./routes/scan.routes.js";

dotenv.config();
const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.devtunnels\.ms$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());
connectToMongo();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/qrcode", qrcodeRoutes);
app.use("/api/scan", scanRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the QR Code Generator API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
