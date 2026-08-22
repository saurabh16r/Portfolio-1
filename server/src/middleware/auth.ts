import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-portfolio-secret-key-12345";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Check Authorization header or cookies
  let token = "";
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.headers.cookie) {
    // Parse simple cookies
    const cookies = req.headers.cookie.split(";").reduce((acc: any, cookie) => {
      const parts = cookie.split("=");
      acc[parts[0].trim()] = (parts[1] || "").trim();
      return acc;
    }, {});
    token = cookies.token || "";
  }

  if (!token) {
    return res.status(401).json({ error: "Access denied. No session token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired session token." });
  }
}
