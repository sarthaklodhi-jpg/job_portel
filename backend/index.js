import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";
import resumeRoutes from "./routes/resume.routes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://job-portel-sage.vercel.app",
  "https://job-portel-r6zd.vercel.app",
];
const isAllowedLocalhostOrigin = (origin) =>
  /^http:\/\/localhost:51\d{2}$/.test(origin || "") ||
  /^http:\/\/127\.0\.0\.1:51\d{2}$/.test(origin || "");

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   CORS (SAFE)
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || isAllowedLocalhostOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   ROUTES
========================= */
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/resume", resumeRoutes);
app.use(notFound);
app.use(errorHandler);

/* =========================
   SERVER
========================= */
const PORT = Number.parseInt(process.env.PORT, 10) || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
