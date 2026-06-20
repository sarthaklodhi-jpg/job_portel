import express from "express";
import { screenResume } from "../controllers/resume.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/screen", isAuthenticated, screenResume);

export default router;
