export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  heroImage?: string;
  technologies: string[];
  liveLink?: string;
  github?: string;
  prototype?: string;
  caseStudy: string;
  accent: string;
  intro: string;
  year: string;
  role: string;
  duration: string;
  overview: string[];
  problem?: string[];
  goals?: string[];
  research?: { number: string; heading: string; description: string }[];
  userPersona?: { name: string; role: string; needs: string[]; painPoints: string[]; quote: string };
  wireframes?: string[];
  designSystem?: {
    colors: { name: string; hex: string }[];
    typography: string[];
    buttons: string[];
    components: string[];
    spacing: string;
    icons: string[];
  };
  finalUi?: { desktop?: string; tablet?: string; mobile?: string }[];
  galleryImages?: string[];
  challenge: string[];
  solution: string[];
  results: string[];
};

export const projects: Project[] = [
  {
    slug: "mamta-superspeciality-hospital",
    title: "Mamta Superspeciality Hospital",
    category: "Healthcare",
    description: "Bringing a 49-year legacy of trust online for the first time",
    image: "/opengraph.jpg",
    heroImage: "/opengraph.jpg",
    technologies: ["UI/UX Design", "Framer", "Web Design", "Responsive Design"],
    caseStudy: "/work/mamta-superspeciality-hospital",
    accent: "from-emerald-500/20 to-slate-900/80",
    intro: "Bringing a 49-year legacy of trust online for the first time",
    year: "2026",
    role: "Lead UI/UX Designer & Framer Developer",
    duration: "4 Weeks",
    liveLink: "https://mamtasuperspecialityhospital.com/",
    overview: [
      "Mamta Superspeciality Hospital has been a trusted multi-speciality healthcare provider in Raipur for over 49 years — offering care across pediatrics, ENT, gastroenterology, orthopedics, respiratory medicine, and general medicine. Despite this legacy, the hospital had no digital presence before this project. This project was brought in through Deven, where I led the end-to-end UI/UX design and Framer development."
    ],
    problem: [
      "A hospital with nearly five decades of patient trust had zero online visibility — no way for patients to discover specialities/doctors, book appointments, verify credibility, or reach emergency numbers quickly."
    ],
    goals: [
      "Build from scratch reflecting 49-year legacy",
      "Make emergency info impossible to miss",
      "Clear browsing-to-booking path",
      "Organize 6+ specialities/multiple doctors without overwhelm",
      "Build trust signals",
      "Keep it simple for a broad, non-tech-savvy audience"
    ],
    challenge: [
      "Structuring content for 6+ specialities and multiple doctors — solved via consistent card system linking specialities to doctor profiles, surfacing only essentials with a 'View Profile' path."
    ],
    solution: [
      "Site recently launched; delivers a professional digital presence matching the hospital's offline reputation, visible emergency numbers on every page, appointment booking without a phone call, clear insurance/cashless info."
    ],
    results: [
      "Site recently launched; delivers a professional digital presence matching the hospital's offline reputation, visible emergency numbers on every page, appointment booking without a phone call, clear insurance/cashless info."
    ]
  },
  {
    slug: "royal-flosss",
    title: "Royal Flosss",
    category: "D2C Gifting",
    description: "India's 1st plant-based wedding return gift — designed and built to convert",
    image: "/opengraph.jpg",
    heroImage: "/opengraph.jpg",
    technologies: ["UI/UX Design", "Framer", "Web Design", "Conversion Design"],
    caseStudy: "/work/royal-flosss",
    accent: "from-rose-500/20 to-slate-900/80",
    intro: "India's 1st plant-based wedding return gift — designed and built to convert",
    year: "2026",
    role: "Lead UI/UX Designer & Framer Developer",
    duration: "4 Weeks",
    liveLink: "https://inventive-star-567738.framer.app/",
    overview: [
      "Royal Flosss is India's first plant-based wedding return gift brand, offering preservative-free gift boxes with full customization (wedding monograms, branded packaging). No prior digital presence. Brought in through Deven; led full UI/UX design and Framer development, including conversion features (budget calculator, sample request flow, reward mechanics)."
    ],
    problem: [
      "A differentiated product with no online presence — couples couldn't preview quality/packaging, estimate gifting budgets, try before a large bulk order, or find a storefront matching the premium positioning."
    ],
    goals: [
      "Premium, conversion-focused page from scratch",
      "Low-risk free sample flow",
      "Instant budget estimation",
      "Urgency/social proof without undermining luxury feel",
      "Clear differentiator messaging (plant-based, no palm oil)",
      "Customization as core offer, not upsell"
    ],
    challenge: [
      "Balancing premium/luxury feel with aggressive conversion tactics (urgency counters, spin-to-win, live calculator) — solved by keeping visual restraint in luxury sections while giving conversion elements their own distinct, playful treatment so both coexist without competing."
    ],
    solution: [
      "Designed a premium storefront combining luxury brand presentation with interactive conversion mechanics, reducing purchase risk through free sample offers and bulk calculators."
    ],
    results: [
      "Site recently launched; premium storefront matching 'India's first' positioning; structured risk-free path to purchase; instant budget clarity for bulk gifting decisions; multiple engagement mechanics building trust for a zero-presence brand."
    ]
  },
  {
    slug: "dadi-sati-hospital",
    title: "Dadi Sati Hospital & Maternity Center",
    category: "Healthcare",
    description: "Safe Motherhood Begins Here — a full hospital presence, built as a single-page experience",
    image: "/opengraph.jpg",
    heroImage: "/opengraph.jpg",
    technologies: ["UI/UX Design", "Framer", "Web Design", "Single-Page Architecture"],
    caseStudy: "/work/dadi-sati-hospital",
    accent: "from-blue-500/20 to-slate-900/80",
    intro: "Safe Motherhood Begins Here — a full hospital presence, built as a single-page experience",
    year: "2026",
    role: "Lead UI/UX Designer & Framer Developer",
    duration: "3 Weeks",
    liveLink: "https://dadisatihospital.framer.website/",
    overview: [
      "Dadi Sati Hospital & Maternity Center is a community hospital trusted since 1998, focused on maternity care and women's health alongside general medicine, pediatrics, dental, and emergency services. No prior website existed. Brought in through Deven; led full UI/UX design and Framer development, built as a single scrollable page rather than a multi-page site."
    ],
    problem: [
      "No digital presence for a hospital trusted locally since 1998, with no way to communicate its maternity specialty, showcase full department range, or provide easy booking/emergency access online."
    ],
    goals: [
      "Complete hospital website from scratch without a large multi-page build",
      "Maternity & women's health as clear primary focus while representing full service range",
      "Prominent trust signals (years of trust, delivery numbers, patient counts)",
      "Simple booking/WhatsApp/emergency path",
      "Simple navigation for a broad local audience"
    ],
    challenge: [
      "Fitting a full multi-department hospital onto a single page without clutter — solved through clear content hierarchy (trust stats + maternity messaging up front, scannable department grid, supporting sections deeper on the page). Note: original plan was Hindi-first copy; client later decided to go English — adapted accordingly while keeping the structure solid."
    ],
    solution: [
      "Designed a clean single scroll architecture displaying service blocks with anchor links, keeping critical contact info stuck to the top and bottom of the view."
    ],
    results: [
      "Site recently launched; first-ever website for a hospital trusted since 1998; maternity/women's health now clearly the front-and-center message; full department breadth represented without overwhelming primary positioning; clear booking/emergency paths from screen one."
    ]
  },
  {
    slug: "finovo",
    title: "Finovo",
    category: "Fintech",
    description: "Track. Save. Grow. — an AI-guided personal finance app",
    image: "/opengraph.jpg",
    heroImage: "/opengraph.jpg",
    technologies: ["UI/UX Design", "Interaction Design", "Product Design", "Prototyping"],
    caseStudy: "/work/finovo",
    accent: "from-teal-500/20 to-slate-900/80",
    intro: "Track. Save. Grow. — an AI-guided personal finance app",
    year: "2026",
    role: "UI/UX Designer (Team Project)",
    duration: "6 Weeks",
    overview: [
      "Finovo is a personal finance app for tracking expenses, budgets, savings, and investments, with an AI financial assistant (GenIndic). Built as a 4-person collaborative team project during my UI/UX internship at Zaalima Development — the team worked together across every step (research, design, prototyping)."
    ],
    problem: [
      "Users lack a unified view of expenses, budgets, savings, and investments, and most finance apps show data without helping users act on it."
    ],
    goals: [
      "Single dashboard for full financial snapshot",
      "Simple daily-use expense/budget tracking",
      "Unified investment overview (stocks, mutual funds, crypto, SIPs)",
      "Conversational, genuinely helpful AI assistant (GenIndic)",
      "Modern trustworthy visual language",
      "Smooth onboarding (signup, login, OTP)"
    ],
    challenge: [
      "Designing an AI assistant experience that feels genuinely useful (not a bolted-on chatbot) — solved with a full-screen conversational interface (voice + keyboard input)."
    ],
    solution: [
      "Collaborated as a design team to align components, create budgeting visual cues, and layout a dedicated full screen GenIndic assistant layout."
    ],
    results: [
      "Designed a complete, cohesive fintech app experience as a 4-person team; unified dashboard across expenses/budgets/savings/investments; explored AI-assisted UX in finance; strengthened collaborative design workflow."
    ]
  },
  {
    slug: "gattani-tiles",
    title: "Gattani Tiles — Square Feet",
    category: "Retail / Interiors",
    description: "Building digital trust for a small-town premium interiors brand, from zero",
    image: "/opengraph.jpg",
    heroImage: "/opengraph.jpg",
    technologies: ["UI/UX Design", "Framer", "Web Design", "Visual Design"],
    caseStudy: "/work/gattani-tiles",
    accent: "from-amber-500/20 to-slate-900/80",
    intro: "Building digital trust for a small-town premium interiors brand, from zero",
    year: "2026",
    role: "Lead UI/UX Designer & Framer Developer",
    duration: "4 Weeks",
    liveLink: "https://gattanitiles.com/",
    overview: [
      "Gattani Tiles (Square Feet) is a premium tiles, granite, sanitary ware, and modular kitchen showroom offering 20,000+ product designs. No prior website existed. Brought in through Deven; led end-to-end UI/UX design and Framer development."
    ],
    problem: [
      "No website meant no way to represent product range/quality online, no way to compete with city showrooms, no easy pricing access, and no visible trust signals."
    ],
    goals: [
      "Premium, trustworthy small-town brand presence",
      "Showcase product scale without overwhelm",
      "Prioritize WhatsApp/quote-form lead gen over full e-commerce",
      "Build credibility via founder story, brand partners, testimonials",
      "Easy location/pricing access"
    ],
    challenge: [
      "Building digital trust for a local, small-town retail brand with no prior branding — solved via real product photography, authentic Hindi/Hinglish testimonials, founder-story section for personal trust."
    ],
    solution: [
      "Implemented a high-aesthetic single page layout built around actual showroom photography and interactive WhatsApp CTA triggers."
    ],
    results: [
      "Client happy with launch; premium credible presence where none existed; multiple lead-gen paths (WhatsApp, quote form, Maps); real testimonials and brand partnerships now visible."
    ]
  },
  {
    slug: "bharosa-bhai",
    title: "Bharosa Bhai",
    category: "Fintech",
    description: "Tumhara Personal Financial Dost — designed and independently developed",
    image: "/opengraph.jpg",
    heroImage: "/opengraph.jpg",
    technologies: ["UI/UX Design", "Web Design", "Interaction Design", "Framer"],
    caseStudy: "/work/bharosa-bhai",
    accent: "from-orange-500/20 to-slate-900/80",
    intro: "Tumhara Personal Financial Dost — designed and independently developed",
    year: "2026",
    role: "UI/UX Designer & Web Developer",
    duration: "5 Weeks",
    liveLink: "https://www.bharosabhai.com/",
    overview: [
      "Bharosa Bhai is a Hindi-first personal finance platform built for a practicing Chartered Accountant, centered on a free 2-minute financial health test, SIP calculator, and 6-month roadmap, delivered through a warm 'financial dost' persona. Client project where I owned the process end-to-end — from UI/UX design through to a fully built, live product."
    ],
    problem: [
      "The CA needed to assess users' financial health and deliver personalized advice, but most advisory sites feel too corporate, jargon-heavy, or sales-driven for a Hindi-first, non-expert audience."
    ],
    goals: [
      "Bias-free, trustworthy 'financial dost' brand voice",
      "2-minute financial test capturing user data",
      "Interactive SIP calculator",
      "Clear 6-month roadmap",
      "Hinglish copy throughout",
      "Build and ship solo"
    ],
    challenge: [
      "Making a CA's advisory process approachable without losing credibility — solved via the bias-free 'Bharosa Bhai' persona and transparent Hinglish voice.",
      "Owning design-to-build solo — built the interactive calculator, multi-step test, and roadmap system independently, compressing the typical design-to-launch timeline."
    ],
    solution: [
      "Designed and built an interactive web experience solo, integrating an illustrated friendly mascot and custom multi-step financial diagnostics."
    ],
    results: [
      "Delivered a fully designed and built product solo, concept to live site; gave the CA a scalable way to pre-qualify clients via the free test; replaced an intimidating pitch with an approachable Hinglish-first experience."
    ]
  },
  {
    slug: "deven",
    title: "Deven",
    category: "Web Application",
    description: "The smartest startup insights in 5 minutes — designed and independently developed from concept to launch",
    image: "/opengraph.jpg",
    heroImage: "/opengraph.jpg",
    technologies: ["UI/UX Design", "Web Design", "Design System", "Editorial UX"],
    caseStudy: "/work/deven",
    accent: "from-purple-500/20 to-slate-900/80",
    intro: "The smartest startup insights in 5 minutes — designed and independently developed from concept to launch",
    year: "2026",
    role: "UI/UX Designer & Framer Developer",
    duration: "8 Weeks",
    liveLink: "https://www.thedeven.in/",
    overview: [
      "Deven is a startup insights platform delivering articles and a newsletter on AI, startup growth, fundraising, product strategy, and operations for founders and operators. As a full-time UI/UX Designer at Deven, I designed the platform and independently developed the web experience, from concept through repositioning to a live product."
    ],
    problem: [
      "Needed a fast, credible way for founders to consume startup-relevant content without noise — while also repositioning mid-project from a narrow India-first, subscription model to a broader global audience."
    ],
    goals: [
      "Clean, fast, editorial-feeling platform from scratch",
      "Clear content taxonomy (Startups, AI, Marketing, Fundraising, Operations, Growth)",
      "Natural newsletter capture flow",
      "Rebuild positioning around a global founder audience"
    ],
    challenge: [
      "Building a clean, fast-loading content/newsletter platform from scratch.",
      "Repositioning mid-project from India-first to a global audience — adapting the existing foundation efficiently rather than restarting."
    ],
    solution: [
      "Designed and built the editorial web platform solo, executing rapid visual modifications during a mid-project repositioning pivot."
    ],
    results: [
      "Took Deven from concept through a full repositioning to a live, working platform; designed and built the entire product experience; established a scalable content structure for ongoing publishing."
    ]
  }
];
