import { Router } from "express";
import { SEO } from "../models/SEO.js";
import { CaseStudy } from "../models/CaseStudy.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

export const defaultSEO = {
  global: {
    siteTitle: "Saurabh Rathore — Premium Framer & UI Designer",
    siteDescription: "Clean, motion-first digital design and high-end Webflow & Framer development.",
    siteUrl: "https://saurabh-rathore.com",
    keywords: "Framer, Webflow, React, UI/UX, Portfolio, Designer, India",
    favicon: "/favicon.ico",
    openGraphImage: "/opengraph.jpg",
    twitterCard: "summary_large_image",
  },
  pages: {
    home: {
      metaTitle: "Saurabh Rathore — Premium Framer & UI Designer",
      metaDescription: "Clean, motion-first digital design and high-end Webflow & Framer development.",
      canonicalUrl: "https://saurabh-rathore.com",
      openGraphTitle: "Saurabh Rathore — Premium Framer & UI Designer",
      openGraphDescription: "Clean, motion-first digital design and high-end Webflow & Framer development.",
      openGraphImage: "/opengraph.jpg",
      twitterCard: "summary_large_image",
      robotsSettings: "index, follow"
    },
    work: {
      metaTitle: "Selected Work — Saurabh Rathore",
      metaDescription: "Case studies of web applications, landing pages, and interactive digital designs.",
      canonicalUrl: "https://saurabh-rathore.com/work",
      openGraphTitle: "Selected Work — Saurabh Rathore",
      openGraphDescription: "Case studies of web applications, landing pages, and interactive digital designs.",
      openGraphImage: "/opengraph.jpg",
      twitterCard: "summary_large_image",
      robotsSettings: "index, follow"
    },
    services: {
      metaTitle: "Services — Saurabh Rathore",
      metaDescription: "Visual product design, Framer development, and whitelabel agency builds.",
      canonicalUrl: "https://saurabh-rathore.com/services",
      openGraphTitle: "Services — Saurabh Rathore",
      openGraphDescription: "Visual product design, Framer development, and whitelabel agency builds.",
      openGraphImage: "/opengraph.jpg",
      twitterCard: "summary_large_image",
      robotsSettings: "index, follow"
    },
    about: {
      metaTitle: "About Saurabh — Designer & Engineer",
      metaDescription: "Work history, skills toolkit, and visual design details.",
      canonicalUrl: "https://saurabh-rathore.com/about",
      openGraphTitle: "About Saurabh — Designer & Engineer",
      openGraphDescription: "Work history, skills toolkit, and visual design details.",
      openGraphImage: "/opengraph.jpg",
      twitterCard: "summary_large_image",
      robotsSettings: "index, follow"
    },
    contact: {
      metaTitle: "Contact Saurabh Rathore — Let's Collaborate",
      metaDescription: "Reach out to discuss budget, project timelines, and design builds.",
      canonicalUrl: "https://saurabh-rathore.com/contact",
      openGraphTitle: "Contact Saurabh Rathore — Let's Collaborate",
      openGraphDescription: "Reach out to discuss budget, project timelines, and design builds.",
      openGraphImage: "/opengraph.jpg",
      twitterCard: "summary_large_image",
      robotsSettings: "index, follow"
    }
  }
};

// GET /api/seo
router.get("/", async (req, res) => {
  try {
    const doc = await SEO.findOne({ key: "site-seo" });
    if (!doc) {
      return res.json(defaultSEO);
    }
    return res.json(doc.data);
  } catch (error) {
    console.error("Fetch SEO error:", error);
    return res.status(500).json({ error: "Failed to fetch SEO settings." });
  }
});

// PUT /api/seo (Protected)
router.put("/", requireAuth, async (req, res) => {
  try {
    let doc = await SEO.findOne({ key: "site-seo" });
    if (!doc) {
      doc = new SEO({ key: "site-seo", data: req.body });
    } else {
      doc.data = req.body;
      doc.markModified("data");
    }

    await doc.save();
    return res.json(doc.data);
  } catch (error) {
    console.error("Save SEO error:", error);
    return res.status(500).json({ error: "Failed to save SEO settings." });
  }
});

// Helper for dynamic sitemap generation
export async function generateSitemapXML(): Promise<string> {
  let doc = await SEO.findOne({ key: "site-seo" });
  const seoData = doc ? doc.data : defaultSEO;
  const baseUrl = seoData.pages.home.canonicalUrl || "https://saurabh-rathore.com";

  const staticPages = ["", "/work", "/services", "/about", "/contact"];
  
  // Fetch published case studies
  const publishedCases = await CaseStudy.find({ status: "published" });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static paths
  staticPages.forEach((path) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${path}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${path === "" ? "1.0" : "0.8"}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Case Studies paths
  publishedCases.forEach((study) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/work/${study.slug}</loc>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

// Helper for dynamic robots.txt generation
export async function generateRobotsTXT(): Promise<string> {
  let doc = await SEO.findOne({ key: "site-seo" });
  const seoData = doc ? doc.data : defaultSEO;
  const baseUrl = seoData.pages.home.canonicalUrl || "https://saurabh-rathore.com";
  
  let txt = `User-agent: *\n`;
  txt += `Allow: /\n`;
  txt += `Disallow: /studio/\n`; // Disallow crawling of Studio Admin pages
  txt += `Disallow: /api/\n`;    // Disallow crawling of raw API endpoints
  txt += `\n`;
  txt += `Sitemap: ${baseUrl}/sitemap.xml\n`;
  
  return txt;
}

export default router;
