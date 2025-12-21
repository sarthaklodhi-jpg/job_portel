import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  deleteCompany,
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// ✅ Register new company (NOW SUPPORTS LOGO UPLOAD)
router.post("/register", isAuthenticated, singleUpload, registerCompany);

// ✅ Get all companies for logged-in user
router.get("/get", isAuthenticated, getCompany);

// ✅ Get company by ID
router.get("/get/:id", isAuthenticated, getCompanyById);

// ✅ Update company by ID (supports logo update)
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany);

router.delete(
  "/delete/:id",
  isAuthenticated,
  deleteCompany
);


export default router;
