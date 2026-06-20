import express from "express";
import {
  login,
  register,
  logout,
  updateProfile,
  completeProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import cloudinary from "../utils/cloudinary.js";
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

// 👇 download resume via backend proxy (sets Content-Disposition)
router.get("/resume/download", async (req, res) => {
  try {
    const { public_id: publicId, filename } = req.query;
    if (!publicId) return res.status(400).send("public_id is required");

    const fileUrl = cloudinary.url(publicId, { resource_type: "raw", secure: true });

    // Use fetch if available (Node 18+), otherwise fallback to https.get
    if (global.fetch) {
      const resp = await global.fetch(fileUrl);
      if (!resp.ok) return res.status(502).send("Failed to fetch file");

      res.setHeader("Content-Type", resp.headers.get("content-type") || "application/octet-stream");
      const dispositionName = filename || "resume";
      res.setHeader("Content-Disposition", `attachment; filename="${dispositionName}"`);

      const buffer = Buffer.from(await resp.arrayBuffer());
      return res.send(buffer);
    }

    // Fallback using https.get
    const https = await import("https");
    https.get(fileUrl, (cloudRes) => {
      res.setHeader("Content-Type", cloudRes.headers["content-type"] || "application/octet-stream");
      const dispositionName = filename || "resume";
      res.setHeader("Content-Disposition", `attachment; filename="${dispositionName}"`);
      cloudRes.pipe(res);
    }).on("error", () => res.status(502).send("Failed to fetch file"));
  } catch (err) {
    console.error("resume download proxy error:", err.message);
    res.status(500).send("Server error");
  }
});

export default router;
