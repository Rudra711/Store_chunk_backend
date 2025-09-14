// models/File.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String }, // e.g., image, video, audio, document, other
    size: Number,
    extension: String,
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    path: [
      { _id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" }, name: String }
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    filePath: { type: String, required: true }, // ✅ actual path on disk (uploads/xxx.png)
    fileUrl: { type: String, required: true },  // ✅ public URL (http://domain/uploads/xxx.png)
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
