import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Content } from "../models/Content.js";
import { SEO } from "../models/SEO.js";
import { CaseStudy } from "../models/CaseStudy.js";
import { defaultContent } from "../routes/content.js";
import { defaultSEO } from "../routes/seo.js";

dotenv.config();

const SEED_EMAIL = process.env.INITIAL_ADMIN_EMAIL || "admin@portfolio.studio";
const SEED_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || "adminpassword123";

// Defining the 7 case studies to be seeded
const sampleProjects = [
  {
    title: "Deven",
    slug: "deven",
    category: "Web Application",
    description: "The smartest startup insights in 5 minutes — designed and independently developed from concept to launch",
    image: "/opengraph.jpg",
    thumbnail: "/opengraph.jpg",
    year: "2026",
    client: "Deven Group (Full-Time Role)",
    industry: "Content / Newsletter Platform",
    duration: "8 Weeks",
    role: "UI/UX Designer & Visual Engineer",
    technologies: ["Content Platform", "AI-Assisted Development", "UI/UX Design", "Full-Time Role", "Solo Build"],
    liveLink: "https://www.thedeven.in/",
    status: "published",
    blocks: [
      {
        type: "Hero",
        data: {
          title: "Deven",
          subtitle: "The smartest startup insights in 5 minutes — designed and independently developed from concept to launch",
          description: "UI/UX Design & AI-Assisted Development (Antigravity) · Content / Newsletter Platform · Deven (Full-Time)"
        }
      },
      {
        type: "Overview",
        data: {
          points: [
            "Deven is a startup insights platform delivering articles and a newsletter on AI, startup growth, fundraising, product strategy, and operations for founders and operators. The product was repositioned mid-project from an India-first, subscription-priced concept to a global, English-first editorial platform. As a full-time UI/UX Designer at Deven, I designed the platform and independently developed it using AI-assisted development (Antigravity), from concept through repositioning to a live product."
          ]
        }
      },
      {
        type: "Problem",
        data: {
          points: [
            "Needed a fast, credible way for founders to consume startup-relevant content without noise — while also repositioning mid-project from a narrow India-first, subscription model to a broader global audience, without a lengthy dev handoff cycle."
          ]
        }
      },
      {
        type: "Goals",
        data: {
          points: [
            "Clean, fast, editorial-feeling platform from scratch",
            "Clear content taxonomy (Startups, AI, Marketing, Fundraising, Operations, Growth)",
            "Natural newsletter capture flow",
            "Rebuild positioning around a global founder audience",
            "Move from design to live product quickly via AI-assisted development"
          ]
        }
      },
      {
        type: "Challenges",
        data: {
          points: [
            "Building a clean, fast-loading content/newsletter platform from scratch, solo, via AI-assisted development.",
            "Repositioning mid-project from India-first to a global audience — adapting the existing foundation efficiently rather than restarting."
          ]
        }
      },
      {
        type: "Results",
        data: {
          points: [
            "Took Deven from concept through a full repositioning to a live, working platform; designed and built the entire product solo without a separate dev handoff; established a scalable content structure for ongoing publishing."
          ]
        }
      },
      {
        type: "Key Learnings",
        data: {
          points: [
            "Repositioning mid-project is normal — adapt the existing foundation rather than starting over",
            "AI-assisted development is especially valuable for content-first products where speed-to-live directly affects how fast you can test positioning",
            "Editorial credibility comes as much from restraint (fast load, minimal clutter) as visual polish"
          ]
        }
      },
      {
        type: "Conclusion",
        data: {
          points: [
            "Deven evolved from an India-first subscription concept into a global startup insights platform — designed and independently developed, end-to-end, and shipped as a live product as part of my full-time role.",
            "Want to see how I design and ship products end-to-end, from concept through repositioning to launch? Let's talk →"
          ]
        }
      }
    ]
  },
  {
    title: "Bharosa Bhai",
    slug: "bharosa-bhai",
    category: "Fintech",
    description: "Tumhara Personal Financial Dost — designed and independently developed",
    image: "/opengraph.jpg",
    thumbnail: "/opengraph.jpg",
    year: "2026",
    client: "Personal CA Client",
    industry: "Financial Advisory",
    duration: "5 Weeks",
    role: "Solo UI/UX Designer & Developer",
    technologies: ["Fintech", "AI-Assisted Development", "UI/UX Design", "Client Work", "Solo Build"],
    liveLink: "https://www.bharosabhai.com/",
    status: "published",
    blocks: [
      {
        type: "Hero",
        data: {
          title: "Bharosa Bhai",
          subtitle: "Tumhara Personal Financial Dost — designed and independently developed",
          description: "UI/UX Design & AI-Assisted Development (Antigravity) · Fintech / Financial Advisory · India"
        }
      },
      {
        type: "Overview",
        data: {
          points: [
            "Bharosa Bhai is a Hindi-first personal finance platform built for a practicing Chartered Accountant, centered on a free 2-minute financial health test, SIP calculator, and 6-month roadmap, delivered through a warm 'financial dost' persona. Client project where I owned the process end-to-end — from UI/UX design through to a fully built, live product — using AI-assisted development (Antigravity) instead of a traditional dev handoff."
          ]
        }
      },
      {
        type: "Problem",
        data: {
          points: [
            "The CA needed to assess users' financial health and deliver personalized advice, but most advisory sites feel too corporate, jargon-heavy, or sales-driven for a Hindi-first, non-expert audience."
          ]
        }
      },
      {
        type: "Goals",
        data: {
          points: [
            "Bias-free, trustworthy 'financial dost' brand voice",
            "2-minute financial test capturing user data",
            "Interactive SIP calculator",
            "Clear 6-month roadmap",
            "Hinglish copy throughout",
            "Build and ship solo via AI-assisted development"
          ]
        }
      },
      {
        type: "Challenges",
        data: {
          points: [
            "Making a CA's advisory process approachable without losing credibility — solved via the bias-free 'Bharosa Bhai' persona and transparent Hinglish voice.",
            "Owning design-to-build solo through AI-assisted development — built the interactive calculator, multi-step test, and roadmap system independently using Antigravity, compressing the typical design-to-launch timeline."
          ]
        }
      },
      {
        type: "Results",
        data: {
          points: [
            "Delivered a fully designed and built product solo, concept to live site; gave the CA a scalable way to pre-qualify clients via the free test; replaced an intimidating pitch with an approachable Hinglish-first experience."
          ]
        }
      },
      {
        type: "Key Learnings",
        data: {
          points: [
            "AI-assisted development compresses the design-to-launch timeline dramatically but still requires strong design judgment to guide it well — it's a force multiplier, not a replacement for process",
            "Brand voice builds trust as much as formal credentials in skeptical categories like finance",
            "Localized tone changes how human a product feels, not just how it reads"
          ]
        }
      },
      {
        type: "Conclusion",
        data: {
          points: [
            "Bharosa Bhai turned a CA's advisory process into an approachable, trust-first digital product — designed and independently developed, end-to-end.",
            "Curious how AI-assisted development can take your project from design to a live product, fast? Let's talk →"
          ]
        }
      }
    ]
  },
  {
    title: "Gattani Tiles — Square Feet",
    slug: "gattani-tiles",
    category: "Retail / Interiors",
    description: "Building digital trust for a small-town premium interiors brand, from zero",
    image: "/opengraph.jpg",
    thumbnail: "/opengraph.jpg",
    year: "2026",
    client: "Gattani Tiles (via Deven)",
    industry: "Retail / Interiors",
    duration: "4 Weeks",
    role: "Lead UI/UX Designer & Framer Developer",
    technologies: ["Retail", "D2C", "Framer", "UI/UX Design", "Client Work"],
    liveLink: "https://gattanitiles.com/",
    status: "published",
    blocks: [
      {
        type: "Hero",
        data: {
          title: "Gattani Tiles — Square Feet",
          subtitle: "Building digital trust for a small-town premium interiors brand, from zero",
          description: "UI/UX Design & Framer Development · Retail / Interiors · Janjgir, C.G."
        }
      },
      {
        type: "Overview",
        data: {
          points: [
            "Gattani Tiles (Square Feet) is a premium tiles, granite, sanitary ware, and modular kitchen showroom offering 20,000+ product designs. No prior website existed. Brought in through Deven; led end-to-end UI/UX design and Framer development."
          ]
        }
      },
      {
        type: "Problem",
        data: {
          points: [
            "No website meant no way to represent product range/quality online, no way to compete with city showrooms, no easy pricing access, and no visible trust signals."
          ]
        }
      },
      {
        type: "Goals",
        data: {
          points: [
            "Premium, trustworthy small-town brand presence",
            "Showcase product scale without overwhelm",
            "Prioritize WhatsApp/quote-form lead gen over full e-commerce",
            "Build credibility via founder story, brand partners, testimonials",
            "Easy location/pricing access"
          ]
        }
      },
      {
        type: "Challenges",
        data: {
          points: [
            "Building digital trust for a local, small-town retail brand with no prior branding — solved via real product photography, authentic Hindi/Hinglish testimonials, founder-story section for personal trust."
          ]
        }
      },
      {
        type: "Results",
        data: {
          points: [
            "Client happy with launch; premium credible presence where none existed; multiple lead-gen paths (WhatsApp, quote form, Maps); real testimonials and brand partnerships now visible."
          ]
        }
      },
      {
        type: "Key Learnings",
        data: {
          points: [
            "Premium doesn't require a big city — it requires clarity and trust structure",
            "For high-trust in-person retail, the site's job is to drive a visit/message, not replace the showroom",
            "Local, authentic testimonials build more credibility than polished generic copy"
          ]
        }
      },
      {
        type: "Conclusion",
        data: {
          points: [
            "Gattani Tiles now has a digital presence matching its showroom's premium quality.",
            "Looking to bring your local business online with a premium, trust-building website? Let's talk →"
          ]
        }
      }
    ]
  },
  {
    title: "Finovo",
    slug: "finovo",
    category: "Fintech",
    description: "Track. Save. Grow. — an AI-guided personal finance app",
    image: "/opengraph.jpg",
    thumbnail: "/opengraph.jpg",
    year: "2026",
    client: "Zaalima Development (Internship)",
    industry: "Fintech",
    duration: "6 Weeks",
    role: "UI/UX Designer (Team Project)",
    technologies: ["Fintech", "Team Project", "UI/UX Design", "Internship"],
    liveLink: "",
    status: "published",
    blocks: [
      {
        type: "Hero",
        data: {
          title: "Finovo",
          subtitle: "Track. Save. Grow. — an AI-guided personal finance app",
          description: "UI/UX Design (Team Project) · Fintech · Zaalima Development Internship"
        }
      },
      {
        type: "Overview",
        data: {
          points: [
            "Finovo is a personal finance app for tracking expenses, budgets, savings, and investments, with an AI financial assistant (GenIndic). Built as a 4-person collaborative team project during my UI/UX internship at Zaalima Development — the team worked together across every step (research, design, prototyping)."
          ]
        }
      },
      {
        type: "Problem",
        data: {
          points: [
            "Users lack a unified view of expenses, budgets, savings, and investments, and most finance apps show data without helping users act on it."
          ]
        }
      },
      {
        type: "Goals",
        data: {
          points: [
            "Single dashboard for full financial snapshot",
            "Simple daily-use expense/budget tracking",
            "Unified investment overview (stocks, mutual funds, crypto, SIPs)",
            "Conversational, genuinely helpful AI assistant (GenIndic)",
            "Modern trustworthy visual language",
            "Smooth onboarding (signup, login, OTP)"
          ]
        }
      },
      {
        type: "Challenges",
        data: {
          points: [
            "Designing an AI assistant experience that feels genuinely useful (not a bolted-on chatbot) — solved with a full-screen conversational interface (voice + keyboard input)."
          ]
        }
      },
      {
        type: "Results",
        data: {
          points: [
            "Designed a complete, cohesive fintech app experience as a 4-person team; unified dashboard across expenses/budgets/savings/investments; explored AI-assisted UX in finance; strengthened collaborative design workflow."
          ]
        }
      },
      {
        type: "Key Learnings",
        data: {
          points: [
            "Designing for finance requires balancing clarity and trust",
            "Collaborative design across 4 people requires strong component/system consistency from the start",
            "AI features work best when conversational and goal-oriented"
          ]
        }
      },
      {
        type: "Conclusion",
        data: {
          points: [
            "Finovo brought everyday finance tracking and AI-guided insight into one cohesive experience — built collaboratively during my UI/UX internship at Zaalima Development.",
            "Interested in how I approach fintech or AI-driven product design? Let's talk →"
          ]
        }
      }
    ]
  },
  {
    title: "Dadi Sati Hospital & Maternity Center",
    slug: "dadi-sati-hospital",
    category: "Healthcare",
    description: "Safe Motherhood Begins Here — a full hospital presence, built as a single-page experience",
    image: "/opengraph.jpg",
    thumbnail: "/opengraph.jpg",
    year: "2026",
    client: "Dadi Sati Hospital (via Deven)",
    industry: "Healthcare / Maternity",
    duration: "3 Weeks",
    role: "Lead UI/UX Designer & Framer Developer",
    technologies: ["Healthcare", "Framer", "UI/UX Design", "Client Work", "Single-Page Architecture"],
    liveLink: "https://dadisatihospital.framer.website/",
    status: "published",
    blocks: [
      {
        type: "Hero",
        data: {
          title: "Dadi Sati Hospital & Maternity Center",
          subtitle: "Safe Motherhood Begins Here — a full hospital presence, built as a single-page experience",
          description: "UI/UX Design & Framer Development · Healthcare / Maternity · Janjgir, C.G."
        }
      },
      {
        type: "Overview",
        data: {
          points: [
            "Dadi Sati Hospital & Maternity Center is a community hospital trusted since 1998, focused on maternity care and women's health alongside general medicine, pediatrics, dental, and emergency services. No prior website existed. Brought in through Deven; led full UI/UX design and Framer development, built as a single scrollable page rather than a multi-page site."
          ]
        }
      },
      {
        type: "Problem",
        data: {
          points: [
            "No digital presence for a hospital trusted locally since 1998, with no way to communicate its maternity specialty, showcase full department range, or provide easy booking/emergency access online."
          ]
        }
      },
      {
        type: "Goals",
        data: {
          points: [
            "Complete hospital website from scratch without a large multi-page build",
            "Maternity & women's health as clear primary focus while representing full service range",
            "Prominent trust signals (years of trust, delivery numbers, patient counts)",
            "Simple booking/WhatsApp/emergency path",
            "Simple navigation for a broad local audience"
          ]
        }
      },
      {
        type: "Challenges",
        data: {
          points: [
            "Fitting a full multi-department hospital onto a single page without clutter — solved through clear content hierarchy (trust stats + maternity messaging up front, scannable department grid, supporting sections deeper on the page). Note: original plan was Hindi-first copy; client later decided to go English — adapted accordingly while keeping the structure solid."
          ]
        }
      },
      {
        type: "Results",
        data: {
          points: [
            "Site recently launched; first-ever website for a hospital trusted since 1998; maternity/women's health now clearly the front-and-center message; full department breadth represented without overwhelming primary positioning; clear booking/emergency paths from screen one."
          ]
        }
      },
      {
        type: "Key Learnings",
        data: {
          points: [
            "A well-structured single page can do the job of a multi-page site — the key is content hierarchy, not page count",
            "Positioning changes how the same department list reads (primary vs. supporting)",
            "Staying flexible on client-driven changes (like the language shift) while keeping structure solid is part of the job"
          ]
        }
      },
      {
        type: "Conclusion",
        data: {
          points: [
            "Dadi Sati Hospital now has a complete, trust-building digital presence built as a focused single-page experience.",
            "Looking to bring your multi-department practice online without an overwhelming multi-page site? Let's talk →"
          ]
        }
      }
    ]
  },
  {
    title: "Royal Flosss",
    slug: "royal-flosss",
    category: "D2C Gifting",
    description: "India's 1st plant-based wedding return gift — designed and built to convert",
    image: "/opengraph.jpg",
    thumbnail: "/opengraph.jpg",
    year: "2026",
    client: "Royal Flosss (via Deven)",
    industry: "D2C / Wedding Gifting",
    duration: "4 Weeks",
    role: "Lead UI/UX Designer & Framer Developer",
    technologies: ["D2C", "Framer", "UI/UX Design", "Client Work", "Conversion Design"],
    liveLink: "https://inventive-star-567738.framer.app/",
    status: "published",
    blocks: [
      {
        type: "Hero",
        data: {
          title: "Royal Flosss",
          subtitle: "India's 1st plant-based wedding return gift — designed and built to convert",
          description: "UI/UX Design & Framer Development · D2C / Wedding Gifting · Raipur, India"
        }
      },
      {
        type: "Overview",
        data: {
          points: [
            "Royal Flosss is India's first plant-based wedding return gift brand, offering preservative-free gift boxes with full customization (wedding monograms, branded packaging). No prior digital presence. Brought in through Deven; led full UI/UX design and Framer development, including conversion features (budget calculator, sample request flow, reward mechanics)."
          ]
        }
      },
      {
        type: "Problem",
        data: {
          points: [
            "A differentiated product with no online presence — couples couldn't preview quality/packaging, estimate gifting budgets, try before a large bulk order, or find a storefront matching the premium positioning."
          ]
        }
      },
      {
        type: "Goals",
        data: {
          points: [
            "Premium, conversion-focused page from scratch",
            "Low-risk free sample flow",
            "Instant budget estimation",
            "Urgency/social proof without undermining luxury feel",
            "Clear differentiator messaging (plant-based, no palm oil)",
            "Customization as core offer, not upsell"
          ]
        }
      },
      {
        type: "Challenges",
        data: {
          points: [
            "Balancing premium/luxury feel with aggressive conversion tactics (urgency counters, spin-to-win, live calculator) — solved by keeping visual restraint in luxury sections while giving conversion elements their own distinct, playful treatment so both coexist without competing."
          ]
        }
      },
      {
        type: "Results",
        data: {
          points: [
            "Site recently launched; premium storefront matching 'India's first' positioning; structured risk-free path to purchase; instant budget clarity for bulk gifting decisions; multiple engagement mechanics building trust for a zero-presence brand."
          ]
        }
      },
      {
        type: "Key Learnings",
        data: {
          points: [
            "Luxury and urgency aren't opposites — they need distinct visual treatment within the same page",
            "Reducing risk (free sample) converts better than urgency alone for high-consideration bulk purchases",
            "An interactive calculator can sell harder than static pricing copy when offers scale with quantity"
          ]
        }
      },
      {
        type: "Conclusion",
        data: {
          points: [
            "Royal Flosss now has a digital storefront combining premium brand presentation with genuine conversion mechanics.",
            "Looking to build a D2C landing page that balances premium branding with real conversion mechanics? Let's talk →"
          ]
        }
      }
    ]
  },
  {
    title: "Mamta Superspeciality Hospital",
    slug: "mamta-superspeciality-hospital",
    category: "Healthcare",
    description: "Bringing a 49-year legacy of trust online for the first time",
    image: "/opengraph.jpg",
    thumbnail: "/opengraph.jpg",
    year: "2026",
    client: "Mamta Superspeciality Hospital (via Deven)",
    industry: "Healthcare",
    duration: "4 Weeks",
    role: "Lead UI/UX Designer & Framer Developer",
    technologies: ["Healthcare", "Framer", "UI/UX Design", "Client Work"],
    liveLink: "https://mamtasuperspecialityhospital.com/",
    status: "published",
    blocks: [
      {
        type: "Hero",
        data: {
          title: "Mamta Superspeciality Hospital",
          subtitle: "Bringing a 49-year legacy of trust online for the first time",
          description: "UI/UX Design & Framer Development · Healthcare · Raipur, India"
        }
      },
      {
        type: "Overview",
        data: {
          points: [
            "Mamta Superspeciality Hospital has been a trusted multi-speciality healthcare provider in Raipur for over 49 years — offering care across pediatrics, ENT, gastroenterology, orthopedics, respiratory medicine, and general medicine. Despite this legacy, the hospital had no digital presence before this project. This project was brought in through Deven, where I led the end-to-end UI/UX design and Framer development."
          ]
        }
      },
      {
        type: "Problem",
        data: {
          points: [
            "A hospital with nearly five decades of patient trust had zero online visibility — no way for patients to discover specialities/doctors, book appointments, verify credibility, or reach emergency numbers quickly."
          ]
        }
      },
      {
        type: "Goals",
        data: {
          points: [
            "Build from scratch reflecting 49-year legacy",
            "Make emergency info impossible to miss",
            "Clear browsing-to-booking path",
            "Organize 6+ specialities/multiple doctors without overwhelm",
            "Build trust signals",
            "Keep it simple for a broad, non-tech-savvy audience"
          ]
        }
      },
      {
        type: "Challenges",
        data: {
          points: [
            "Structuring content for 6+ specialities and multiple doctors — solved via consistent card system linking specialities to doctor profiles, surfacing only essentials with a 'View Profile' path."
          ]
        }
      },
      {
        type: "Results",
        data: {
          points: [
            "Site recently launched; delivers a professional digital presence matching the hospital's offline reputation, visible emergency numbers on every page, appointment booking without a phone call, clear insurance/cashless info."
          ]
        }
      },
      {
        type: "Key Learnings",
        data: {
          points: [
            "Designing for trust means restraint",
            "Structuring multi-layered content early prevents late-stage clutter",
            "Emergency-first UX must be visible from screen one"
          ]
        }
      },
      {
        type: "Conclusion",
        data: {
          points: [
            "Mamta Superspeciality Hospital now has a digital front door that matches the trust it has built over 49 years.",
            "Looking to build a healthcare website that earns trust from the first screen? Let's talk →"
          ]
        }
      }
    ]
  }
];

async function seed() {
  try {
    await connectDB();

    console.log("Seeding started...");

    // 1. Seed Admin User
    const adminExists = await User.findOne({});
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12);
      const newUser = new User({
        name: "Administrator",
        email: SEED_EMAIL.toLowerCase(),
        password: hashedPassword,
      });
      await newUser.save();
      console.log(`Admin user created in database: ${SEED_EMAIL}`);
    } else {
      console.log("Admin user already exists in database. Skipping creation.");
    }

    // 2. Seed Content
    const existingContent = await Content.findOne({ key: "site-content" });
    if (!existingContent) {
      const newContent = new Content({
        key: "site-content",
        data: defaultContent,
      });
      await newContent.save();
      console.log("Default website content copy seeded.");
    } else {
      console.log("Website content document already exists.");
    }

    // 3. Seed SEO Settings
    const existingSEO = await SEO.findOne({ key: "site-seo" });
    if (!existingSEO) {
      const newSEO = new SEO({
        key: "site-seo",
        data: defaultSEO,
      });
      await newSEO.save();
      console.log("Default global/page SEO metadata seeded.");
    } else {
      console.log("SEO settings document already exists.");
    }

    // 4. Seed Case Studies (Clearing and re-inserting)
    console.log("Clearing existing case studies...");
    await CaseStudy.deleteMany({});
    
    console.log("Inserting new case studies...");
    for (const proj of sampleProjects) {
      const newStudy = new CaseStudy(proj);
      await newStudy.save();
      // Sleep slightly to guarantee ordered timestamps
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    
    const finalCount = await CaseStudy.countDocuments();
    console.log(`Seeded ${finalCount} case studies successfully.`);

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
}

seed();
