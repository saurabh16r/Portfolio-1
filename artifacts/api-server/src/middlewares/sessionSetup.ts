import session from "express-session";

declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
  }
}

const secret = process.env["SESSION_SECRET"] ?? "sr-portfolio-secret-change-me";

export const sessionMiddleware = session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    maxAge: 1000 * 60 * 60 * 8,
  },
});
