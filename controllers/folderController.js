// controllers/folderController.js
import Folder from "../models/Folder.js";
import File from "../models/File.js";
import fs from "fs/promises";
import path from "path";

// Create folder
export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id;

    let pathArr = [];
    if (parentId) {
      const parent = await Folder.findOne({ _id: parentId, userId });
      if (!parent) return res.status(404).json({ error: "Parent folder not found" });
      pathArr = [...parent.path, { _id: parent._id, name: parent.name }];
    }

    const folder = new Folder({ name, parentId: parentId || null, path: pathArr, userId });
    await folder.save();
    res.json(folder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get folder by ID
export const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!folder) return res.status(404).json({ error: "Folder not found" });
    res.json(folder);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// List child folders
export const listFolders = async (req, res) => {
  try {
    const parentId = req.query.parentId || null;
    const userId = req.user.id;
    const parentVal = parentId === "" ? null : parentId;
    const folders = await Folder.find({ parentId: parentVal, userId }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update folder
export const updateFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!folder) return res.status(404).json({ error: "Folder not found" });

    folder.name = name || folder.name;
    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Recursive delete helper
async function deleteFolderRecursive(folderId, userId, uploadDir) {
  const files = await File.find({ folderId, userId });
  for (const f of files) {
    try {
      const physicalPath = path.join(process.cwd(), f.fileUrl);
      await fs.unlink(physicalPath).catch(() => {});
    } catch (err) {
      console.warn("Failed to delete file:", err.message);
    }
    await f.deleteOne();
  }

  const childFolders = await Folder.find({ parentId: folderId, userId });
  for (const child of childFolders) {
    await deleteFolderRecursive(child._id, userId, uploadDir);
  }

  await Folder.deleteOne({ _id: folderId, userId });
}

// Delete folder
export const deleteFolder = async (req, res) => {
  try {
    const { recursive } = req.query;
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!folder) return res.status(404).json({ error: "Folder not found" });

    if (recursive === "true") {
      await deleteFolderRecursive(folder._id, req.user.id, process.env.UPLOAD_DIR || "uploads");
    } else {
      const hasChildren = await Folder.exists({ parentId: folder._id, userId: req.user.id });
      const hasFiles = await File.exists({ folderId: folder._id, userId: req.user.id });
      if (hasChildren || hasFiles) {
        return res.status(400).json({ error: "Folder not empty. Use recursive delete." });
      }
      await Folder.deleteOne({ _id: folder._id, userId: req.user.id });
    }

    res.json({ message: "Folder deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
