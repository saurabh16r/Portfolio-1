import { Router, type IRouter } from "express";
import { getProjects, getServices, getProfile, getSettings } from "../lib/db.js";
import { homePage, caseStudyPage } from "../views/portfolio.js";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const [projects, services, profile, settings] = await Promise.all([
      getProjects(),
      getServices(),
      getProfile(),
      getSettings(),
    ]);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(homePage(projects, services, profile, settings));
  } catch (err) {
    req.log.error({ err }, "Error rendering homepage");
    res.status(500).send("Internal Server Error");
  }
});

router.get("/project/:slug", async (req, res) => {
  try {
    const projects = await getProjects();
    const project = projects.find(p => p.slug === req.params["slug"]);
    if (!project || !project.visible) {
      res.status(404).send(`<!DOCTYPE html><html><head><title>Not Found</title></head><body style="background:#000;color:#666;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;"><div><h1 style="font-size:40px;color:#fff;margin-bottom:16px;">404</h1><p>Project not found.</p><a href="/" style="color:#C0C0C0;margin-top:20px;display:block;">← Back to Portfolio</a></div></body></html>`);
      return;
    }
    const visible = projects.filter(p => p.visible && p.id !== project.id).sort((a, b) => a.order - b.order);
    const nextProject = visible[0];
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(caseStudyPage(project, nextProject));
  } catch (err) {
    req.log.error({ err }, "Error rendering case study");
    res.status(500).send("Internal Server Error");
  }
});

export default router;
