import { Router } from "express";
import { Experience } from "../models/Experience.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/experience
// Public endpoint, option to filter by audience
router.get("/", async (req, res) => {
  try {
    const { audience } = req.query;
    let query: any = { isVisible: true };
    if (audience && typeof audience === "string") {
      query.audience = { $in: [audience, "both"] };
    }
    const experiences = await Experience.find(query).sort({ order: 1, createdAt: -1 });
    return res.json(experiences);
  } catch (error) {
    console.error("Fetch experience error:", error);
    return res.status(500).json({ error: "Failed to fetch experience items." });
  }
});

// GET /api/experience/all (Protected, admin panel listing)
router.get("/all", requireAuth, async (req, res) => {
  try {
    const experiences = await Experience.find({}).sort({ order: 1, createdAt: -1 });
    return res.json(experiences);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch all experience items." });
  }
});

// POST /api/experience (Protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { role, company, startDate, endDate, description, location, technologies, order, isVisible, audience } = req.body;
    const newExp = new Experience({
      role,
      company,
      startDate,
      endDate: endDate || "Present",
      description: description || "",
      location: location || "",
      technologies: technologies || [],
      order: order !== undefined ? order : 0,
      isVisible: isVisible !== undefined ? isVisible : true,
      audience: audience || "job",
    });
    await newExp.save();
    return res.status(201).json(newExp);
  } catch (error) {
    console.error("Create experience error:", error);
    return res.status(500).json({ error: "Failed to create experience." });
  }
});

// PUT /api/experience/:id (Protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!exp) {
      return res.status(404).json({ error: "Experience item not found." });
    }
    return res.json(exp);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update experience item." });
  }
});

// DELETE /api/experience/:id (Protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) {
      return res.status(404).json({ error: "Experience item not found." });
    }
    return res.json({ message: "Experience item deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete experience item." });
  }
});

export default router;
