import { getProjects, setProjects, getServices, setServices, getProfile, setProfile, getSettings, setSettings, type Project, type Service } from "./db.js";
import { v4 as uuidv4 } from "uuid";
import { logger } from "./logger.js";

export async function seedIfEmpty(): Promise<void> {
  const existing = await getProjects();
  if (existing.length > 0) return;

  logger.info("Seeding DB with initial project data...");

  const projects: Project[] = [
    {
      id: uuidv4(),
      slug: "aeron",
      title: "Aeron",
      tagline: "Reimagining fashion e-commerce for the next generation",
      category: "E-Commerce",
      visible: true,
      thumbnail_gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      thumbnail_url: "",
      role: "UI/UX Designer & Framer Developer",
      timeline: "3 weeks",
      tools: ["Figma", "Framer", "Prototyping"],
      type: "E-Commerce · Mobile App",
      overview: {
        challenge: "Fashion shoppers abandon carts because they can't visualise how clothes look on them. Aeron solves this with AR try-ons and 360° product views, making online shopping feel like in-store. The core problem was translating a tactile, physical experience into pixels — without losing the emotional connection people have with fashion.",
        my_role: [
          "Led end-to-end UI/UX design from discovery to delivery",
          "Designed AR try-on interface and 360° product viewer flows",
          "Created high-fidelity Figma prototypes and interactive Framer builds",
          "Conducted usability testing with 8 participants",
          "Collaborated with the engineering team on feasibility constraints",
          "Delivered all production-ready design tokens and component library",
        ],
      },
      research: [
        { number: "01", heading: "Cart Abandonment", description: "70% of online fashion shoppers abandon carts due to uncertainty about fit and appearance — the single biggest conversion killer in e-commerce." },
        { number: "02", heading: "Visual Trust Gap", description: "Users trust products 3x more when shown on multiple body types and real environments — flat product shots on white backgrounds build the least trust." },
        { number: "03", heading: "Mobile-First Shoppers", description: "78% of Aeron's target audience shops primarily on mobile. The design had to be thumb-friendly, fast-loading, and feel native — not a desktop site squeezed to fit." },
      ],
      solution_features: [
        { title: "Immersive Product Views", description: "Replaced static product images with a 360° viewer and seamless AR try-on toggle — accessible in one tap. Built using Framer's advanced interaction system, the transition between angles is fluid and sub-100ms.", image_url: "" },
        { title: "AR Try-On Interface", description: "Designed a camera overlay UI that places garments on the user in real-time. Minimal chrome, maximum focus on the product — controls fade when not in use. The interface uses familiar gestures: pinch to resize, tap to switch colours.", image_url: "" },
        { title: "Frictionless Checkout", description: "Redesigned the cart and checkout flow from 6 steps to 2. Saved addresses, one-tap payment, and a confirmation that doubles as a shareable receipt. Every micro-interaction was tested — tap targets are 44px minimum.", image_url: "" },
      ],
      results: [
        { number: "3x", label: "Engagement increase" },
        { number: "40%", label: "Faster checkout flow" },
        { number: "92%", label: "User satisfaction score" },
      ],
      learnings: {
        worked: [
          "Starting with real user pain points (cart abandonment) kept the design grounded in actual problems, not assumed ones.",
          "Rapid low-fidelity testing before committing to hi-fi saved two full rounds of revision on the AR interface.",
          "Building in Framer alongside the visual design meant feasibility was validated in real-time — no surprises in handoff.",
        ],
        improve: [
          "Spend more time on accessibility — colour contrast on the AR overlay was an afterthought, not a foundation.",
          "Include more body diversity in prototype testing; most participants shared a similar physical profile.",
          "Define a design token system earlier — naming conventions drifted between components and slowed final handoff.",
        ],
      },
      order: 1,
    },
    {
      id: uuidv4(),
      slug: "finovo",
      title: "Finovo",
      tagline: "Making money management effortless for Gen Z",
      category: "FinTech",
      visible: true,
      thumbnail_gradient: "linear-gradient(135deg, #111111 0%, #222222 100%)",
      thumbnail_url: "",
      role: "UI/UX Designer",
      timeline: "2 weeks",
      tools: ["Figma", "Prototyping", "User Research"],
      type: "FinTech · Mobile App",
      overview: {
        challenge: "Gen Z avoids finance apps because they feel complicated and boring. Finovo redesigns the entire experience to feel like a social app — simple, visual, and actually enjoyable to use. The challenge wasn't adding features — it was stripping complexity down to its core and making financial literacy feel approachable, even fun.",
        my_role: [
          "End-to-end UI/UX design — research through delivery",
          "Conducted 10 user interviews with Gen Z participants (18–24)",
          "Defined information architecture and core user flows",
          "Designed all screens in Figma with a component-based system",
          "Created interactive prototypes for usability testing",
          "Iterated based on two rounds of user feedback",
        ],
      },
      research: [
        { number: "01", heading: "Anxiety by Design", description: "83% of Gen Z users in interviews said existing finance apps make them feel 'stressed' or 'judged.' The language, colour choices, and dense data were the primary culprits." },
        { number: "02", heading: "Visual Over Verbal", description: "Participants responded 4x better to visual data (charts, progress rings, icons) than to text-heavy tables. Finance information needs to be felt, not read." },
        { number: "03", heading: "Social Proof Works", description: "When framed as challenges or goals shared with peers, saving behaviour increased in 7 of 10 participants. Community context changes how money feels." },
      ],
      solution_features: [
        { title: "A Dashboard That Feels Alive", description: "Replaced tables and ledgers with a visual-first dashboard. Spending rings, animated balance reveals, and a mood-based colour system that shifts based on your financial health.", image_url: "" },
        { title: "Goals That Feel Social", description: "Savings goals are designed like challenges — with progress bars, milestone celebrations, and the option to share with friends. Users can set a goal in 15 seconds: pick a name, set a target, choose a deadline.", image_url: "" },
        { title: "Plain-English Insights", description: "Every data insight is written in conversational language. The tone is a friend who understands money — not a bank that's judging you. Copy was tested with 6 participants and rewritten twice.", image_url: "" },
      ],
      results: [
        { number: "68%", label: "Reduction in perceived complexity" },
        { number: "4.8/5", label: "Average usability test score" },
        { number: "9x", label: "More likely to return daily" },
      ],
      learnings: {
        worked: [
          "Reframing the design problem as emotional, not functional, unlocked the real solution. Users didn't need more features — they needed less fear.",
          "Diary studies over 3 days gave richer data than one-hour interviews — real behaviour, not remembered behaviour.",
          "Testing copy as rigorously as visuals — the language of the app had more impact on user confidence than colour or layout.",
        ],
        improve: [
          "Build a more robust design system earlier — component drift across 40+ screens added friction in the final handoff.",
          "Test with users who have anxiety around money specifically, not just general Gen Z users — the edge cases matter most here.",
          "Prototype the onboarding flow sooner — it was the last thing designed and the first thing users experienced.",
        ],
      },
      order: 2,
    },
  ];

  await setProjects(projects);

  const services: Service[] = [
    { id: uuidv4(), icon: "◈", title: "UI/UX Design", description: "End-to-end product design — from wireframes to pixel-perfect interfaces. Built for real users, tested rigorously.", price: "Starting at ₹15,000", visible: true },
    { id: uuidv4(), icon: "◇", title: "Framer Development", description: "Production-ready Framer sites with custom interactions, CMS integration, and performance-optimised animations.", price: "Starting at ₹20,000", visible: true },
    { id: uuidv4(), icon: "◉", title: "Brand Design", description: "Visual identity systems — logo, typography, colour, and the full design language that makes a brand unmistakable.", price: "Starting at ₹25,000", visible: true },
  ];
  await setServices(services);

  await setProfile({
    tagline: "Framer Designer & Developer",
    bio: "I craft premium digital experiences — from pixel-perfect UI design to production-ready Framer builds. Based in India, working globally.",
    photo_url: "",
    skills: ["Figma", "Framer", "UI Design", "UX Research", "Prototyping", "Brand Design"],
    email: "saurabh@example.com",
    phone: "",
    linkedin: "https://www.linkedin.com/in/saurabh-singh-rathore-04a982332/",
    behance: "https://www.behance.net/ankitrathore29",
  });

  await setSettings({
    site_title: "Saurabh Rathore — Framer Designer & Developer",
    meta_description: "Portfolio of Saurabh Rathore — UI/UX Designer and Framer Developer crafting premium digital experiences.",
    admin_password_hash: "",
  });

  logger.info("DB seeded successfully.");
}
