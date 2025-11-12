import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

// ✅ Apply for a job
// ✅ Apply for a job
router.route("/apply/:id").post(isAuthenticated, applyJob);


// ✅ Get all jobs applied by the logged-in user
router.route("/get").get(isAuthenticated, getAppliedJobs);

// ✅ Admin: Get all applicants for a specific job
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

// ✅ Admin: Update application status
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;
