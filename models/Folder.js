// models/Folder.js
import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  path: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" }, name: String }], // breadcrumb
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Folder", folderSchema);
