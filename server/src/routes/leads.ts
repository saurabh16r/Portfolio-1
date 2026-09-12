import { Router } from "express";
import { Lead } from "../models/Lead.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/leads
// Public submission route from client-side ContactForm
router.post("/", async (req, res) => {
  try {
    const { name, email, company, phone, budget, timeline, message, sourcePage, projectType, type } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newLead = new Lead({
      name,
      email,
      company,
      phone,
      budget: budget || "Not specified",
      timeline: timeline || "Not specified",
      message,
      projectType: projectType || "",
      type: type || "freelance",
      sourcePage: sourcePage || "Contact",
      status: "new"
    });

    await newLead.save();
    return res.status(201).json(newLead);
  } catch (error) {
    console.error("Lead submission error:", error);
    return res.status(500).json({ error: "Failed to submit request." });
  }
});

// GET /api/leads (Protected)
router.get("/", requireAuth, async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }

    let leadsQuery = Lead.find(query);

    // Apply sorting
    if (sort === "oldest") {
      leadsQuery = leadsQuery.sort({ createdAt: 1 });
    } else {
      // Default: newest first
      leadsQuery = leadsQuery.sort({ createdAt: -1 });
    }

    const leads = await leadsQuery;
    return res.json(leads);
  } catch (error) {
    console.error("Fetch leads error:", error);
    return res.status(500).json({ error: "Failed to fetch leads." });
  }
});

// PUT /api/leads/:id (Protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.json(lead);
  } catch (error) {
    console.error("Update lead error:", error);
    return res.status(500).json({ error: "Failed to update lead." });
  }
});

// DELETE /api/leads/:id (Protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found." });
    }
    return res.json({ message: "Lead deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete lead." });
  }
});

export default router;
