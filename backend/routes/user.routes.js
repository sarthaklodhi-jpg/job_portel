import express from "express";
import {
  login,
  register,
  logout,
  updateProfile,
  completeProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, multiUpload } from "../middlewares/multer.js";
import { googleLogin } from "../controllers/google.authcontroller.js";
import validateProfileUpdate from "../middlewares/validateProfileUpdate.js";

const router = express.Router();

router.post("/register", multiUpload, register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/logout", logout);

// 👇 profile update needs photo + resume
router.post(
  "/profile/update",
  isAuthenticated,
  multiUpload,
  validateProfileUpdate,
  updateProfile
);

// 👇 complete profile needs ONLY ONE file
router.post(
  "/complete-profile",
  isAuthenticated,
  multiUpload,
  completeProfile
);

export default router;
