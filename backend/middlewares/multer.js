import multer from "multer";

// ✅ Use memory storage (REQUIRED for Cloudinary + DataURI)
const storage = multer.memoryStorage();

// ✅ "file" must match frontend FormData key
export const singleUpload = multer({ storage }).single("file");
