import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { api } from "@/services/api.js";
import { Layout, Code, Wrench, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const defaultSkills = [
  // UI/UX DESIGN
  { name: "User Interface Design", category: "UI/UX DESIGN" },
  { name: "User Experience Design", category: "UI/UX DESIGN" },
  { name: "Visual Design", category: "UI/UX DESIGN" },
  { name: "Responsive Design", category: "UI/UX DESIGN" },
  { name: "Interaction Design", category: "UI/UX DESIGN" },
  { name: "Prototyping", category: "UI/UX DESIGN" },
  { name: "Design Systems", category: "UI/UX DESIGN" },
  { name: "Information Architecture", category: "UI/UX DESIGN" },
  
  // WEB DESIGN
  { name: "Landing Pages", category: "WEB DESIGN" },
  { name: "Marketing Websites", category: "WEB DESIGN" },
  { name: "Portfolio Websites", category: "WEB DESIGN" },
  { name: "Responsive Web Design", category: "WEB DESIGN" },
  { name: "Conversion-focused Experiences", category: "WEB DESIGN" },
  { name: "Interaction & Motion", category: "WEB DESIGN" },

  // FRAMER
  { name: "Framer Development", category: "FRAMER" },
  { name: "Responsive Framer Websites", category: "FRAMER" },
  { name: "Framer CMS", category: "FRAMER" },
  { name: "Framer Animations", category: "FRAMER" },
  { name: "Interactive Prototypes", category: "FRAMER" },
  { name: "Custom Components", category: "FRAMER" },
  { name: "Advanced Layouts", category: "FRAMER" },
  { name: "SEO & Performance", category: "FRAMER" },
  
  // TOOLS
  { name: "Figma", category: "TOOLS" },
  { name: "Framer", category: "TOOLS" },
  { name: "Git & GitHub", category: "TOOLS" },

  // SUPPORTING DEVELOPMENT
  { name: "HTML5 / CSS3", category: "SUPPORTING DEVELOPMENT" },
  { name: "JavaScript", category: "SUPPORTING DEVELOPMENT" },
  { name: "React", category: "SUPPORTING DEVELOPMENT" },
  { name: "Tailwind CSS", category: "SUPPORTING DEVELOPMENT" },
  { name: "Framer Motion", category: "SUPPORTING DEVELOPMENT" },
];

const categoryConfig: Record<string, { label: string; icon: any }> = {
  "UI/UX DESIGN": { label: "Core Interface & Systems", icon: Layout },
  "WEB DESIGN": { label: "Digital & Marketing Web", icon: Sparkles },
  "FRAMER": { label: "Framer & Interactive Build", icon: Wrench },
  "TOOLS": { label: "Design & Workflow Tools", icon: Wrench },
  "SUPPORTING DEVELOPMENT": { label: "Secondary Frontend Stack", icon: Code },
  "DESIGN": { label: "Design Capabilities", icon: Layout },
  "DEVELOPMENT": { label: "Supporting Stack", icon: Code },
};

export function SkillsSection() {
  const [skillsList, setSkillsList] = useState<any[]>(defaultSkills);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const live = await api.get("/skills?audience=job");
        if (live && live.length > 0) {
          setSkillsList(live);
        }
      } catch (err) {
        console.log("Using fallback skills data.");
      }
    };
    fetchSkills();
  }, []);

  const categories = Array.from(new Set(skillsList.map((s) => s.category || "UI/UX DESIGN")));

  return (
    <section id="skills" className="px-6 pt-0 pb-[160px] sm:px-8 lg:px-12 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Capabilities" title="Skills & Expertise" number="04" className="mb-16" />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((catKey) => {
            const config = categoryConfig[catKey] || { label: catKey, icon: Sparkles };
            const Icon = config.icon;
            const categorySkills = skillsList.filter((s) => (s.category || "DESIGN") === catKey);

            return (
              <motion.div
                key={catKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-[6px] border border-white/[0.08] bg-[#0B0B0B] p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/[0.06]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-accent">
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.25em] text-accent font-bold block">Category</span>
                      <h3 className="font-display text-lg uppercase tracking-wider text-white">
                        {catKey}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-6 font-bold">
                    {config.label}
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {categorySkills.map((skill: any) => (
                      <span
                        key={skill._id || skill.name}
                        className="inline-flex items-center rounded-[4px] border border-white/[0.08] bg-[#050505] px-3.5 py-2 text-[11px] font-mono text-white/80 hover:border-accent/40 hover:text-white transition-all cursor-none select-none"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
