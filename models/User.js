import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 2 * 1024 * 1024 * 1024 }, // 2GB

    // 🔑 For password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
