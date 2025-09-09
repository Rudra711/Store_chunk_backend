// routes/files.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import auth from "../middleware/auth.js";

import {
  uploadFile,
  listFiles,
  updateFile,
  deleteFile,
  downloadFile
} from "../controllers/fileController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config
const uploadDir = process.env.UPLOAD_DIR || "uploads";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, basename + ext);
  }
});
const upload = multer({ storage });

// Routes
router.post("/", auth, upload.single("file"), uploadFile);
router.get("/", auth, listFiles);
router.put("/:id", auth, updateFile);
router.delete("/:id", auth, deleteFile);
router.get("/:id/download", auth, downloadFile);

export default router;
