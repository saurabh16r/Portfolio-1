import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import caseStudiesRoutes from "./routes/caseStudies.js";
import leadsRoutes from "./routes/leads.js";
import contentRoutes from "./routes/content.js";
import seoRoutes, { generateSitemapXML, generateRobotsTXT } from "./routes/seo.js";
import mediaRoutes from "./routes/media.js";
import postsRoutes from "./routes/posts.js";

dotenv.config();

// Strict environment variable guards for production
if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "fallback-portfolio-secret-key-12345") {
    console.error("FATAL ERROR: JWT_SECRET must be explicitly configured with a strong random key in production.");
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI must be explicitly configured in production.");
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Enable CORS
const configuredClientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  ...configuredClientUrls
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin ? origin.replace(/\/+$/, "") : "";
      if (!origin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        if (process.env.NODE_ENV === "production") {
          callback(new Error("CORS request blocked in production: Origin not allowed."));
        } else {
          callback(null, true); // Fallback for ease of local development
        }
      }
    },
    credentials: true,
  })
);

// Mount Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for ease of React integration on localhost
  })
);
app.use(mongoSanitize());

// Rate Limiting (limit general requests)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." }
});
app.use("/api/", apiLimiter);

// Serve uploads statically
const localUploadDir = path.resolve("uploads");
if (fs.existsSync(localUploadDir)) {
  app.use("/uploads", express.static(localUploadDir));
}

// Database Connection Check Middleware
const checkDbConnection = (req: any, res: any, next: any) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "MongoDB connection failed. Please check your database connection or whitelisting settings." });
  }
  next();
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    database: dbStatus
  });
});

// REST routes
app.use("/api/auth", checkDbConnection, authRoutes);
app.use("/api/case-studies", checkDbConnection, caseStudiesRoutes);
app.use("/api/leads", checkDbConnection, leadsRoutes);
app.use("/api/content", checkDbConnection, contentRoutes);
app.use("/api/seo", checkDbConnection, seoRoutes);
app.use("/api/media", checkDbConnection, mediaRoutes);
app.use("/api/posts", checkDbConnection, postsRoutes);

// Dynamic sitemap.xml route
app.get("/sitemap.xml", async (req, res) => {
  try {
    const xml = await generateSitemapXML();
    res.header("Content-Type", "application/xml");
    return res.send(xml);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return res.status(500).end();
  }
});

// Dynamic robots.txt route
app.get("/robots.txt", async (req, res) => {
  try {
    const txt = await generateRobotsTXT();
    res.header("Content-Type", "text/plain");
    return res.send(txt);
  } catch (error) {
    console.error("Robots generation failed:", error);
    return res.status(500).end();
  }
});

// Root check route
app.get("/", (req, res) => {
  res.json({ message: "Portfolio Studio CMS API is running." });
});

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
