import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";

const router = express.Router();

// ✅ Register new company
router.post("/register", isAuthenticated, registerCompany);

// ✅ Get all companies for logged-in user
router.get("/get", isAuthenticated, getCompany);

// ✅ Get company by ID
router.get("/get/:id", isAuthenticated, getCompanyById);

// ✅ Update company by ID
router.put("/update/:id", isAuthenticated, updateCompany);

export default router;
