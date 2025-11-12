import multer from "multer";
import path from "path";

// Define where and how files will be stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder name
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g. 16983212345.png
  },
});

// Create single file upload middleware
export const singleUpload = multer({ storage }).single("file");
// The string "file" must match the frontend input name attribute
