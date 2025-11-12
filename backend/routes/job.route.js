     // ==========================================
// 📂 FILE: routes/job.routes.js
// ==========================================

import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // ✅ fixed path
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js"; // ✅ fixed path and typo

const router = express.Router();

// ==========================================
// 🧩 JOB ROUTES
// ==========================================

// ✅ Create a new job (Admin only)
router.post("/post", isAuthenticated, postJob);

// ✅ Get all jobs (Anyone logged in can see)
router.get("/get", isAuthenticated, getAllJobs);

// ✅ Get all jobs created by the logged-in admin
router.get("/getadminjobs", isAuthenticated, getAdminJobs);

// ✅ Get a specific job by its ID
router.get("/get/:id", isAuthenticated, getJobById);

export default router;
