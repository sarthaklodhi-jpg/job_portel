import multer from "multer";

// ✅ Memory storage (Cloudinary + DataURI)
const storage = multer.memoryStorage();
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isResume = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ].includes(file.mimetype);

  if (["profilePhoto", "companyLogo", "file"].includes(file.fieldname) && !isImage) {
    return cb(new Error("Only image files are allowed for profile photo/company logo"));
  }

  if (file.fieldname === "resume" && !isResume) {
    return cb(new Error("Resume must be a PDF or Word document"));
  }

  cb(null, true);
};

/* ================================
   🔹 For COMPLETE PROFILE (single file)
================================ */
export const singleUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
}).single("file");

/* ================================
   🔹 For PROFILE UPDATE (photo + resume)
================================ */
export const multiUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
}).fields([
  { name: "file", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
]);
