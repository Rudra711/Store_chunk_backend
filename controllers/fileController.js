// controllers/fileController.js
import fs from "fs";
import path from "path";
import Folder from "../models/Folder.js";
import File from "../models/File.js";

// Upload file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });
    const { folderId } = req.body;
    const userId = req.user.id;

    let pathArr = [];
    if (folderId) {
      const parent = await Folder.findOne({ _id: folderId, userId });
      if (!parent) return res.status(404).json({ error: "Parent folder not found" });
      pathArr = [...parent.path, { _id: parent._id, name: parent.name }];
    }

    // detect file type
    const mime = req.file.mimetype || "";
    let type = "other";
    if (mime.startsWith("image/")) type = "image";
    else if (mime.startsWith("video/")) type = "video";
    else if (mime.startsWith("audio/")) type = "audio";
    else if (mime.includes("pdf") || mime.includes("word") || mime.includes("sheet") || mime.includes("excel") || mime.includes("text")) {
      type = "document";
    }

    const fileDoc = new File({
      name: req.file.originalname,
      type,
      size: req.file.size,
      extension: path.extname(req.file.originalname).replace(".", ""),
      folderId: folderId || null,
      path: pathArr,
      userId,
      fileUrl: `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}`
    });

    await fileDoc.save();
    res.json(fileDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// List files in folder
export const listFiles = async (req, res) => {
  try {
    const folderId = req.query.folderId || null;
    const folderVal = folderId === "" ? null : folderId;
    const files = await File.find({ folderId: folderVal, userId: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update file (rename)
export const updateFile = async (req, res) => {
  try {
    const { name } = req.body;
    const file = await File.findOne({ _id: req.params.id, userId: req.user.id });
    if (!file) return res.status(404).json({ error: "File not found" });
    file.name = name || file.name;
    await file.save();
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user.id });
    if (!file) return res.status(404).json({ error: "File not found" });

    const physicalPath = path.join(process.cwd(), file.fileUrl);
    fs.unlink(physicalPath, (err) => {
      if (err) console.warn("Error deleting physical file:", err.message);
    });

    await file.deleteOne();
    res.json({ message: "File deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Download file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user.id });
    if (!file) return res.status(404).json({ error: "File not found" });

    const absolute = path.join(process.cwd(), file.fileUrl);
    res.download(absolute, file.name);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
