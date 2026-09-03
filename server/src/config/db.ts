import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("FATAL CONFIGURATION ERROR: MONGODB_URI environment variable is not configured.");
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    mongoose.set("strictQuery", true);

    // Mask password for safe logging
    const sanitizedUri = uri.replace(/\/\/(.*):(.*)@/, "//***:***@");
    console.log(`[Database] Connecting to MongoDB (${sanitizedUri})...`);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds if unable to reach database
    });

    console.log("[Database] MongoDB connected successfully.");
  } catch (error: any) {
    const rawMessage = error?.message || String(error);

    // Redact password if it somehow appeared in the raw error message
    const sanitizedError = rawMessage.replace(/mongodb\+srv:\/\/[^@]+@/, "mongodb+srv://***:***@");

    console.error("[Database Error] MongoDB connection failed!");
    console.error(`[Database Error] Details: ${sanitizedError}`);

    if (
      sanitizedError.includes("ETIMEDOUT") ||
      sanitizedError.includes("ENOTFOUND") ||
      sanitizedError.includes("Server selection timed out") ||
      error?.name === "MongooseServerSelectionError"
    ) {
      console.error(
        "[Database Diagnostic] Connection timed out or DNS lookup failed. Ensure MongoDB Atlas Network Access allows connections (add 0.0.0.0/0 under Atlas Network Access -> IP Whitelist)."
      );
    } else if (
      sanitizedError.includes("Authentication failed") ||
      sanitizedError.includes("authFailed") ||
      error?.code === 8000
    ) {
      console.error(
        "[Database Diagnostic] Authentication failed. Please verify the database user credentials in your MONGODB_URI environment variable on Render."
      );
    }

    throw error;
  }
}
