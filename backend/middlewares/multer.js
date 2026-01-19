import multer from "multer";

// ✅ Memory storage (Cloudinary + DataURI)
const storage = multer.memoryStorage();

/* ================================
   🔹 For COMPLETE PROFILE (single file)
================================ */
export const singleUpload = multer({ storage }).single("file");

/* ================================
   🔹 For PROFILE UPDATE (photo + resume)
================================ */
export const multiUpload = multer({ storage }).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);
