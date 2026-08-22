import { Router } from "express";
import { CaseStudy } from "../models/CaseStudy.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/case-studies
// Public endpoint, lists all published items or all items if authenticated
router.get("/", async (req, res) => {
  try {
    const { status, limit } = req.query;
    let query: any = {};
    
    // If not authenticated, force status to published
    if (status) {
      query.status = status;
    } else {
      // Default behavior: client gets published case studies, unless requested
      query.status = "published";
    }

    let studies = CaseStudy.find(query).sort({ createdAt: -1 });
    if (limit) {
      studies = studies.limit(Number(limit));
    }
    
    const results = await studies;
    return res.json(results);
  } catch (error) {
    console.error("Fetch case studies error:", error);
    return res.status(500).json({ error: "Failed to fetch case studies." });
  }
});

// GET /api/case-studies/all (Protected, gets everything for admin panel listing)
router.get("/all", requireAuth, async (req, res) => {
  try {
    const studies = await CaseStudy.find({}).sort({ createdAt: -1 });
    return res.json(studies);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch all case studies." });
  }
});

// GET /api/case-studies/:slug
router.get("/:slug", async (req, res) => {
  try {
    const study = await CaseStudy.findOne({ slug: req.params.slug });
    if (!study) {
      return res.status(404).json({ error: "Case study not found." });
    }
    return res.json(study);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch case study." });
  }
});

// POST /api/case-studies (Protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      image,
      imagePublicId,
      thumbnail,
      thumbnailPublicId,
      year,
      client,
      industry,
      duration,
      role,
      technologies,
      liveLink,
      github,
      prototype,
      status,
      blocks
    } = req.body;

    const existing = await CaseStudy.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: "A case study with this slug already exists." });
    }

    const newStudy = new CaseStudy({
      title,
      slug,
      category,
      description,
      image,
      imagePublicId: imagePublicId || "",
      thumbnail,
      thumbnailPublicId: thumbnailPublicId || "",
      year,
      client,
      industry,
      duration,
      role,
      technologies,
      liveLink,
      github,
      prototype,
      status: status || "draft",
      blocks: blocks || []
    });

    await newStudy.save();
    return res.status(201).json(newStudy);
  } catch (error) {
    console.error("Create case study error:", error);
    return res.status(500).json({ error: "Failed to create case study." });
  }
});

// PUT /api/case-studies/:id (Protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const study = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!study) {
      return res.status(404).json({ error: "Case study not found." });
    }

    return res.json(study);
  } catch (error) {
    console.error("Update case study error:", error);
    return res.status(500).json({ error: "Failed to update case study." });
  }
});

// POST /api/case-studies/:id/duplicate (Protected)
router.post("/:id/duplicate", requireAuth, async (req, res) => {
  try {
    const source = await CaseStudy.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ error: "Source case study not found." });
    }

    const baseSlug = `${source.slug}-copy`;
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Check if slug copy exists, loop to ensure uniqueness
    while (await CaseStudy.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const duplicate = new CaseStudy({
      title: `${source.title} (Copy)`,
      slug: finalSlug,
      category: source.category,
      description: source.description,
      image: source.image,
      imagePublicId: source.imagePublicId || "",
      thumbnail: source.thumbnail,
      thumbnailPublicId: source.thumbnailPublicId || "",
      year: source.year,
      client: source.client,
      industry: source.industry,
      duration: source.duration,
      role: source.role,
      technologies: source.technologies,
      liveLink: source.liveLink,
      github: source.github,
      prototype: source.prototype,
      status: "draft", // Always duplicate as draft
      blocks: source.blocks
    });

    await duplicate.save();
    return res.status(201).json(duplicate);
  } catch (error) {
    console.error("Duplicate error:", error);
    return res.status(500).json({ error: "Failed to duplicate case study." });
  }
});

// DELETE /api/case-studies/:id (Protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const study = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!study) {
      return res.status(404).json({ error: "Case study not found." });
    }
    return res.json({ message: "Case study deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete case study." });
  }
});

export default router;
