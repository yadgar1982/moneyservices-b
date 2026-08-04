import "./config/env.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import logger from "morgan";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "./Scheduler/backupScheduler.js"; 

import registerRouter from "./routes/AdminRoutes/register.route.js";
import transactionRouter from "./routes/UserRoutes/transaction.route.js";
import comissionRouter from "./routes/UserRoutes/comission.route.js";
import loginRouter from "./routes/publicrouts/login.route.js";
import brandingRouter from "./routes/AdminRoutes/branding.route.js";
import currencyRouter from "./routes/AdminRoutes/currency.route.js";
import branchRouter from "./routes/AdminRoutes/branch.route.js";
import backupRouter from "./routes/AdminRoutes/backup.route.js";
import autoBackupRoute from "./routes/AdminRoutes/autoBackup.route.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7777;

// Middleware


const allowedOrigins = [
  "http://localhost:5173",
  "https://moneyservices-f.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));


// Static Files

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/userProfile", express.static(path.join(__dirname, "uploads/userUpload")));
app.use("/brandingLogo", express.static(path.join(__dirname, "uploads/logoUpload")));

// --------------------
// Routes
// --------------------
app.use("/api/user", registerRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/comission", comissionRouter);
app.use("/api/auth", loginRouter);
app.use("/api/branding", brandingRouter);
app.use("/api/currency", currencyRouter);
app.use("/api/branch", branchRouter);
app.use("/api/backup",backupRouter);
app.use("/api/auto-backup",autoBackupRoute);
// --------------------
// 404 Handler
// --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: "Route not found",
  });
});

// --------------------
// Global Error Handler
// --------------------
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(500).json({
    success: false,
    msg: "Internal Server Error",
  });
});

// --------------------
// DB + Server Start
// --------------------
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected database:", mongoose.connection.name);
console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(" DB connection failed:", err.message);
    process.exit(1); // stop app if DB fails
  }
};

startServer();