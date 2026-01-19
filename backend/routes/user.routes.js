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

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/logout", logout);

// 👇 profile update needs photo + resume
router.post(
  "/profile/update",
  isAuthenticated,
  multiUpload,
  updateProfile
);

// 👇 complete profile needs ONLY ONE file
router.post(
  "/complete-profile",
  isAuthenticated,
  singleUpload,
  completeProfile
);

export default router;
