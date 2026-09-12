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
    description: "Lead visual design systems and high-converting frontend architectures for core SaaS products, establishing premium visual languages and engineering standards.",
    highlights: [
      "Built scalable React layout systems and optimized component rendering loops.",
      "Designed pixel-perfect Figma component frameworks and token systems.",
      "Developed premium interactive Framer websites with high-fidelity transitions.",
      "Improved performance check metrics and Core Web Vitals scores by 35%.",
      "Collaborated with product teams to translate conceptual ideas to code."
    ],
    technologies: ["React", "Framer", "Tailwind", "TypeScript", "Figma", "Node.js"]
  },
  {
    role: "UI/UX & Framer Developer Intern",
    company: "Deven",
    period: "Feb 2026 – Apr 2026",
    type: "Internship",
    description: "Designed landing pages and created interactive prototypes for high-end digital agency clients, ensuring smooth performance and visual fidelity.",
    highlights: [
      "Created custom components and custom motion controllers inside Framer.",
      "Assisted in visual layout wireframes and user testing protocols.",
      "Refined CSS animations to increase page responsiveness and loading times."
    ],
    technologies: ["Framer", "Figma", "CSS", "JavaScript", "HTML5"]
  },
  {
    role: "UI/UX Designer · Top Performer",
    company: "Zaalima Development",
    period: "Apr 2025 – Jul 2025",
    type: "Internship",
    description: "Executed end-to-end UX research and mockups for high-traffic mobile and web applications, winning the top internship performance award.",
    highlights: [
      "Conducted 15+ in-depth user research sessions and usability surveys.",
      "Designed and delivered high-fidelity mobile mockups for client signoffs.",
      "Shipped interactive user flows and prototyping assets directly to engineering."
    ],
    technologies: ["Figma", "UI/UX Design", "User Research", "Adobe Illustrator"]
  }
];
