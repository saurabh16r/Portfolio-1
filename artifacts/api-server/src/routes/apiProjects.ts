import { Router, type IRouter } from "express";
import { v4 as uuidv4 } from "uuid";
import { getProjects, setProjects, getServices, setServices, getProfile, setProfile, getSettings, setSettings, type Project, type Service, type Profile, type SiteSettings } from "../lib/db.js";
import { requireAdmin } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

router.use(requireAdmin);

// PROJECTS
router.post("/projects", async (req, res) => {
  try {
    const projects = await getProjects();
    const body = req.body as Partial<Project>;
    const newProject: Project = {
      id: uuidv4(),
      slug: body.slug ?? body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ?? uuidv4(),
      title: body.title ?? "Untitled",
      tagline: body.tagline ?? "",
      category: body.category ?? "Other",
      visible: body.visible ?? true,
      thumbnail_gradient: body.thumbnail_gradient ?? "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
      thumbnail_url: body.thumbnail_url ?? "",
      role: body.role ?? "",
      timeline: body.timeline ?? "",
      tools: body.tools ?? [],
      type: body.type ?? "",
      overview: body.overview ?? { challenge: "", my_role: [] },
      research: body.research ?? [],
      solution_features: body.solution_features ?? [],
      results: body.results ?? [],
      learnings: body.learnings ?? { worked: [], improve: [] },
      order: body.order ?? projects.length + 1,
    };
    projects.push(newProject);
    await setProjects(projects);
    res.json({ success: true, project: newProject });
  } catch (err) {
    req.log.error({ err }, "Create project error");
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/projects/reorder", async (req, res) => {
  try {
    const { order } = req.body as { order: Record<string, number> };
    const projects = await getProjects();
    projects.forEach(p => { if (order[p.id] !== undefined) p.order = order[p.id]; });
    await setProjects(projects);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Reorder error");
    res.status(500).json({ error: "Failed to reorder" });
  }
});

router.put("/projects/:id", async (req, res) => {
  try {
    const projects = await getProjects();
    const idx = projects.findIndex(p => p.id === req.params["id"]);
    if (idx === -1) { res.status(404).json({ error: "Not found" }); return; }
    const body = req.body as Partial<Project>;
    projects[idx] = { ...projects[idx], ...body, id: projects[idx].id };
    await setProjects(projects);
    res.json({ success: true, project: projects[idx] });
  } catch (err) {
    req.log.error({ err }, "Update project error");
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    const projects = await getProjects();
    const filtered = projects.filter(p => p.id !== req.params["id"]);
    await setProjects(filtered);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete project error");
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// SERVICES
router.put("/services", async (req, res) => {
  try {
    const { services } = req.body as { services: Service[] };
    await setServices(services);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Save services error");
    res.status(500).json({ error: "Failed to save services" });
  }
});

// PROFILE
router.put("/profile", async (req, res) => {
  try {
    const body = req.body as Partial<Profile>;
    const current = await getProfile();
    await setProfile({ ...current, ...body });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Save profile error");
    res.status(500).json({ error: "Failed to save profile" });
  }
});

// SETTINGS
router.put("/settings", async (req, res) => {
  try {
    const body = req.body as { site_title?: string; meta_description?: string; new_password?: string };
    const current = await getSettings();
    const updated: SiteSettings = {
      ...current,
      site_title: body.site_title ?? current.site_title,
      meta_description: body.meta_description ?? current.meta_description,
    };
    if (body.new_password) {
      updated.admin_password_hash = body.new_password;
      process.env["ADMIN_PASSWORD"] = body.new_password;
    }
    await setSettings(updated);
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Save settings error");
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
