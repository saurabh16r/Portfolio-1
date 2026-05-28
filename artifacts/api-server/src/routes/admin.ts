import { Router, type IRouter } from "express";
import type { Request, Response } from "express";
import { requireAdmin } from "../middlewares/adminAuth.js";
import { getProjects, getServices, getProfile, getSettings } from "../lib/db.js";
import {
  loginPage, dashboardPage, projectsListPage, projectFormPage,
  servicesPage, profilePage, settingsPage,
} from "../views/admin.js";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "admin123";

const loginAttempts: Map<string, { count: number; resetAt: number }> = new Map();

function getClientIp(req: Request): string {
  return String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown");
}

function isRateLimited(ip: string): boolean {
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) { loginAttempts.delete(ip); return false; }
  return entry.count >= 5;
}

function recordAttempt(ip: string): void {
  const entry = loginAttempts.get(ip);
  if (!entry || Date.now() > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: Date.now() + 5 * 60 * 1000 });
  } else {
    entry.count++;
  }
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

router.get("/", (_req, res) => res.redirect("/admin/dashboard"));
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

router.get("/login", (req, res) => {
  if (req.session?.authenticated) { res.redirect("/admin/dashboard"); return; }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(loginPage());
});

router.post("/login", (req, res) => {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(loginPage("Too many attempts. Wait 5 minutes."));
    return;
  }
  const { password } = req.body as { password?: string };
  if (password === ADMIN_PASSWORD) {
    clearAttempts(ip);
    req.session.authenticated = true;
    req.session.save(() => res.redirect("/admin/dashboard"));
  } else {
    recordAttempt(ip);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(loginPage("Incorrect password"));
  }
});

router.use(requireAdmin);

router.get("/dashboard", async (req, res) => {
  try {
    const projects = await getProjects();
    const visible = projects.filter(p => p.visible).length;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(dashboardPage({
      total: projects.length,
      visible,
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    }));
  } catch (err) {
    req.log.error({ err }, "Dashboard error");
    res.status(500).send("Error loading dashboard");
  }
});

router.get("/projects", async (req, res) => {
  try {
    const projects = (await getProjects()).sort((a, b) => a.order - b.order);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(projectsListPage(projects));
  } catch (err) {
    req.log.error({ err }, "Projects list error");
    res.status(500).send("Error loading projects");
  }
});

router.get("/projects/new", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(projectFormPage());
});

router.get("/projects/:id/edit", async (req, res) => {
  try {
    const projects = await getProjects();
    const project = projects.find(p => p.id === req.params["id"]);
    if (!project) { res.status(404).send("Project not found"); return; }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(projectFormPage(project));
  } catch (err) {
    req.log.error({ err }, "Edit form error");
    res.status(500).send("Error loading project");
  }
});

router.get("/services", async (req, res) => {
  try {
    const services = await getServices();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(servicesPage(services));
  } catch (err) {
    req.log.error({ err }, "Services page error");
    res.status(500).send("Error loading services");
  }
});

router.get("/profile", async (req, res) => {
  try {
    const p = await getProfile();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(profilePage(p));
  } catch (err) {
    req.log.error({ err }, "Profile page error");
    res.status(500).send("Error loading profile");
  }
});

router.get("/settings", async (req, res) => {
  try {
    const s = await getSettings();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(settingsPage(s));
  } catch (err) {
    req.log.error({ err }, "Settings page error");
    res.status(500).send("Error loading settings");
  }
});

export default router;
