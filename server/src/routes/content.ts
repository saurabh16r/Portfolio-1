import { Router } from "express";
import { Content } from "../models/Content.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Default visual fallback copy data to populate on first load
export const defaultContent = {
  navigation: {
    logoText: "SR",
    menuItems: [
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" }
    ]
  },
  home: {
    heroTitle: "Digital Product Designer & Engineer",
    heroSubtitle: "Available for Q3 - Q4 projects",
    heroDescription: "I shape high-converting websites and motion-first interfaces for high-growth startups and global brands.",
    ctaPrimary: "See My Work",
    ctaSecondary: "Start a Project",
    quotes: [
      "\"Good design is not how it looks — it's how it feels.\"",
      "\"Every pixel should have a purpose.\"",
      "\"Great products are built through thoughtful design, not decoration.\""
    ]
  },
  services: {
    title: "Services Preview",
    eyebrow: "Expertise",
    list: [
      {
        title: "Landing Pages",
        description: "High-converting, fast-loading Framer pages that make visitors stay and take action.",
        price: "Starting at ₹8,000"
      },
      {
        title: "Business Websites",
        description: "Multi-page Framer websites for studios, brands, and ambitious businesses that need presence and performance.",
        price: "Starting at ₹18,000"
      },
      {
        title: "Agency Whitelabel",
        description: "Reliable Framer builds for agencies that want a high-quality behind-the-scenes partner.",
        price: "Let's talk pricing"
      }
    ]
  },
  about: {
    title: "About Me",
    eyebrow: "Biography",
    heading: "Saurabh Rathore",
    biography: "I am a visual product designer and frontend engineer focused on high-end interactive websites and functional systems. I combine visual aesthetics with high-performance code structures.",
    subBio: "Based in India, I help digital agencies and tech startups build conversion-driven landing pages, interactive SaaS dashboards, and complete component design libraries using Figma, Framer, and React.",
    skillsTitle: "Core Toolkit",
    skills: ["Framer", "Figma", "UI/UX Design", "Prototyping", "Web Design", "Interaction Design"],
    marquee: ["FRAMER DEVELOPMENT", "UI/UX DESIGN", "LANDING PAGES", "BRAND WEBSITES", "FAST DELIVERY"],
    stats: [
      { label: "Projects shipped", value: "20+" },
      { label: "Years building", value: "3+" },
      { label: "Response time", value: "24h" }
    ],
    resumeLink: "https://resume.example.com/saurabh-rathore.pdf"
  },
  contact: {
    title: "Let's Talk",
    eyebrow: "Get In Touch",
    subtitle: "Have a project in mind?",
    description: "Send me a message with your target budget and project timelines, and I'll get back to you within 24 hours.",
    email: "thisissaurabhrathore@gmail.com",
    whatsapp: "+91 72984 22436",
    formSuccess: "Thank you. I have received your details. I'll get back to you within 24 hours.",
    socials: [
      { platform: "Twitter", url: "https://twitter.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "Dribbble", url: "https://dribbble.com" }
    ]
  },
  footer: {
    copyright: "© 2026 Saurabh Rathore. All rights reserved."
  }
};

// GET /api/content
// Public route fetching live copy config
router.get("/", async (req, res) => {
  try {
    const doc = await Content.findOne({ key: "site-content" });
    if (!doc) {
      // Return initial defaults
      return res.json(defaultContent);
    }
    return res.json(doc.data);
  } catch (error) {
    console.error("Fetch content error:", error);
    return res.status(500).json({ error: "Failed to load site content." });
  }
});

// PUT /api/content (Protected)
router.put("/", requireAuth, async (req, res) => {
  try {
    let doc = await Content.findOne({ key: "site-content" });
    if (!doc) {
      doc = new Content({ key: "site-content", data: req.body });
    } else {
      doc.data = req.body;
      doc.markModified("data");
    }
    
    await doc.save();
    return res.json(doc.data);
  } catch (error) {
    console.error("Save content error:", error);
    return res.status(500).json({ error: "Failed to save site content." });
  }
});

export default router;
