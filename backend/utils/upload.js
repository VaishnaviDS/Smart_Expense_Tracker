import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
fileFilter(req, file, cb) {
  if (
    file.mimetype !== "application/pdf" &&
    !file.mimetype.startsWith("image")
  ) {
    return cb(new Error("Only PDF or images allowed"));
  }
  cb(null, true);
}
});
