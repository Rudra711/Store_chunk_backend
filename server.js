// server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import fs from "fs";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import folderRoutes from "./routes/folders.js";
import fileRoutes from "./routes/files.js";

const app = express();
app.use(cors());
app.use(express.json());

// ensure upload dir exists
const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// static serve uploaded files
app.use(`/${uploadDir}`, express.static(path.join(process.cwd(), uploadDir)));


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;
await connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/drive_db");

app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
