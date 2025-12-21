     // ==========================================
// 📂 FILE: routes/job.routes.js
// ==========================================

import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"; // ✅ fixed path
import {
  deleteJob,
  
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

// ✅ Get all jobs (public)
router.get("/gets", getAllJobs);

// ✅ Get all jobs created by the logged-in admin
router.get("/getadminjobs", isAuthenticated, getAdminJobs);

// ✅ Get a specific job by its ID
router.get("/get/:id", isAuthenticated, getJobById);


router.delete(
  "/delete/:id",
  isAuthenticated,
  deleteJob
);

export default router;
