import { Router } from "express";
import { Skill } from "../models/Skill.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/skills
// Public endpoint for skills, option to filter by audience
router.get("/", async (req, res) => {
  try {
    const { audience } = req.query;
    let query: any = { isVisible: true };
    if (audience && typeof audience === "string") {
      query.audience = { $in: [audience, "both"] };
    }
    const skills = await Skill.find(query).sort({ order: 1, createdAt: -1 });
    return res.json(skills);
  } catch (error) {
    console.error("Fetch skills error:", error);
    return res.status(500).json({ error: "Failed to fetch skills." });
  }
});

// GET /api/skills/all (Protected, admin panel listing)
router.get("/all", requireAuth, async (req, res) => {
  try {
    const skills = await Skill.find({}).sort({ order: 1, createdAt: -1 });
    return res.json(skills);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch all skills." });
  }
});

// POST /api/skills (Protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, category, order, isVisible, audience } = req.body;
    const newSkill = new Skill({
      name,
      category: category || "DESIGN",
      order: order !== undefined ? order : 0,
      isVisible: isVisible !== undefined ? isVisible : true,
      audience: audience || "job",
    });
    await newSkill.save();
    return res.status(201).json(newSkill);
  } catch (error) {
    console.error("Create skill error:", error);
    return res.status(500).json({ error: "Failed to create skill." });
  }
});

// PUT /api/skills/:id (Protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!skill) {
      return res.status(404).json({ error: "Skill not found." });
    }
    return res.json(skill);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update skill." });
  }
});

// DELETE /api/skills/:id (Protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found." });
    }
    return res.json({ message: "Skill deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete skill." });
  }
});

export default router;
