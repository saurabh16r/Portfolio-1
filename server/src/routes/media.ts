import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Configure Multer memory storage (keeps files in buffer to stream or write on demand)
const upload = multer({ storage: multer.memoryStorage() });

// Configure Cloudinary if credentials are provided
const hasCloudinaryEnv = !!(
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_API_KEY ||
  process.env.CLOUDINARY_API_SECRET
);

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary storage enabled.");
} else {
  if (hasCloudinaryEnv) {
    console.error("WARNING: Cloudinary credentials are only partially configured. Missing required variables among (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).");
  }
  console.log("Cloudinary credentials missing or incomplete. Falling back to local server storage.");
  // Ensure local uploads folder exists
  const localUploadDir = path.resolve("uploads");
  if (!fs.existsSync(localUploadDir)) {
    fs.mkdirSync(localUploadDir, { recursive: true });
  }
}

// In-memory list to track upload items if using local fallback
// In production, media items can also be fetched from Cloudinary search API
// For absolute robustness, we will store/return an array of media resources
router.get("/list", requireAuth, async (req, res) => {
  try {
    if (useCloudinary) {
      // Fetch latest uploads from Cloudinary
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: "portfolio-studio",
        max_results: 50
      });
      const items = result.resources.map((r: any) => ({
        id: r.public_id,
        url: r.secure_url,
        name: r.filename || path.basename(r.secure_url),
        createdAt: r.created_at,
        size: r.bytes
      }));
      return res.json(items);
    } else {
      // Read local uploads folder
      const localUploadDir = path.resolve("uploads");
      if (!fs.existsSync(localUploadDir)) {
        return res.json([]);
      }
      const files = fs.readdirSync(localUploadDir);
      const items = files.map((file) => {
        const filePath = path.join(localUploadDir, file);
        const stat = fs.statSync(filePath);
        return {
          id: file,
          url: `/uploads/${file}`,
          name: file,
          createdAt: stat.birthtime,
          size: stat.size
        };
      });
      return res.json(items);
    }
  } catch (error) {
    console.error("List media error:", error);
    return res.status(500).json({ error: "Failed to list media items." });
  }
});

// POST /api/media/upload
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    if (useCloudinary) {
      // Stream buffer directly to Cloudinary
      const uploadStream = (fileBuffer: Buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "portfolio-studio", resource_type: "auto" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(fileBuffer);
        });
      };

      const result: any = await uploadStream(req.file.buffer);
      return res.status(201).json({
        url: result.secure_url,
        id: result.public_id,
        name: result.original_filename || req.file.originalname,
        size: result.bytes
      });
    } else {
      // Save locally to uploads folder
      const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
      const localUploadDir = path.resolve("uploads");
      const destPath = path.join(localUploadDir, filename);

      fs.writeFileSync(destPath, req.file.buffer);

      return res.status(201).json({
        url: `/uploads/${filename}`,
        id: filename,
        name: req.file.originalname,
        size: req.file.size
      });
    }
  } catch (error: any) {
    console.error("Upload media error:", error);
    return res.status(500).json({ error: "Failed to upload media asset." });
  }
});

// DELETE /api/media/:id
router.delete("/:id(*)", requireAuth, async (req, res) => {
  try {
    const id = req.params.id;

    if (useCloudinary) {
      const result = await cloudinary.uploader.destroy(id);
      if (result.result !== "ok") {
        return res.status(400).json({ error: "Failed to delete from Cloudinary." });
      }
      return res.json({ message: "Media deleted successfully." });
    } else {
      const localUploadDir = path.resolve("uploads");
      const destPath = path.join(localUploadDir, id);
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
        return res.json({ message: "Media deleted successfully." });
      } else {
        return res.status(404).json({ error: "Media item not found." });
      }
    }
  } catch (error) {
    console.error("Delete media error:", error);
    return res.status(500).json({ error: "Failed to delete media asset." });
  }
});

export default router;
