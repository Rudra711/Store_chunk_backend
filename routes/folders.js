// routes/folders.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  createFolder,
  getFolderById,
  listFolders,
  updateFolder,
  deleteFolder
} from "../controllers/folderController.js";

const router = express.Router();

router.post("/", auth, createFolder);
router.get("/:id", auth, getFolderById);
router.get("/", auth, listFolders);
router.put("/:id", auth, updateFolder);
router.delete("/:id", auth, deleteFolder);

export default router;
