import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";

dotenv.config();

const app = express();

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   CORS (FINAL FIX)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portel-r6zd.vercel.app", // 👈 EXACT frontend URL
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =========================
   TEST ROUTE
========================= */
app.get("/home", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello from backend",
  });
});

/* =========================
   ROUTES
========================= */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
