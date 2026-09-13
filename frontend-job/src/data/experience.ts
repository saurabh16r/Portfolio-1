export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  type: string;
  active?: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "UI/UX Designer & Framer Developer",
    company: "Deven",
    period: "May 2026 – Present",
    type: "Full-time",
    active: true,
    description: "Designed and developed responsive digital experiences from initial wireframes to final Framer implementation, establishing brand visual languages and interactive component systems.",
    highlights: [
      "Designed pixel-perfect Figma components, layout structures, and design tokens.",
      "Developed responsive Framer websites with smooth micro-interactions and transitions.",
      "Optimized visual layouts and asset sizes for high Core Web Vitals performance.",
      "Collaborated with product teams to translate conceptual ideas into interactive digital experiences."
    ],
    technologies: ["UI/UX Design", "Framer", "Figma", "Web Design", "Interaction Design"]
  },
  {
    role: "UI/UX & Framer Developer Intern",
    company: "Deven",
    period: "Feb 2026 – Apr 2026",
    type: "Internship",
    description: "Designed landing pages and built interactive prototypes for client projects, ensuring high visual fidelity and responsive layouts.",
    highlights: [
      "Created custom interactive components and layout transitions in Framer.",
      "Assisted in visual layout wireframing, typography hierarchy, and UI audits.",
      "Refined animations and page responsiveness across mobile and desktop breakpoints."
    ],
    technologies: ["UI/UX Design", "Framer", "Figma", "Web Design", "Prototyping"]
  },
  {
    role: "UI/UX Designer · Top Performer",
    company: "Zaalima Development",
    period: "Apr 2025 – Jul 2025",
    type: "Internship",
    description: "Executed end-to-end UX research, wireframing, and interface mockups for high-traffic mobile and web applications, winning top internship performance award.",
    highlights: [
      "Conducted 15+ in-depth user research sessions and usability studies.",
      "Designed high-fidelity mobile and web mockups for product sign-offs.",
      "Shipped interactive user flows and UI asset kits directly to engineering."
    ],
    technologies: ["UI/UX Design", "Figma", "User Research", "Wireframing", "Prototyping"]
  }
];
