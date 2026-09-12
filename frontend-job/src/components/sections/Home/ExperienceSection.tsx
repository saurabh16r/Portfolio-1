import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { api } from "@/services/api.js";
import { Calendar, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const defaultExperience = [
  {
    role: "Senior UI/UX Designer & Engineer",
    company: "Studio Craft",
    startDate: "2023",
    endDate: "Present",
    location: "Remote / India",
    description: "Led design systems, interactive component libraries, and motion-first landing pages for tech startups.",
    technologies: ["React", "TypeScript", "Framer", "Figma", "Tailwind"],
  },
  {
    role: "Frontend Developer & Designer",
    company: "Digital Edge Agency",
    startDate: "2022",
    endDate: "2023",
    location: "India",
    description: "Built high-performance web products, SaaS dashboards, and conversion-focused marketing sites.",
    technologies: ["JavaScript", "HTML/CSS", "React", "Figma"],
  },
  {
    role: "Product Design Intern",
    company: "TechVentures",
    startDate: "2021",
    endDate: "2022",
    location: "India",
    description: "Collaborated on mobile app wireframing, UX research, and interactive prototyping.",
    technologies: ["Figma", "Prototyping", "UI Design"],
  },
];

export function ExperienceSection() {
  const [experienceList, setExperienceList] = useState<any[]>(defaultExperience);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const live = await api.get("/experience?audience=job");
        if (live && live.length > 0) {
          setExperienceList(live);
        }
      } catch (err) {
        console.log("Using fallback experience timeline.");
      }
    };
    fetchExperience();
  }, []);

  return (
    <section id="experience" className="px-6 pt-0 pb-[160px] sm:px-8 lg:px-12 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Career Track" title="Experience Timeline" number="05" className="mb-16" />

        <div className="relative pl-6 sm:pl-8 border-l border-white/[0.08] space-y-12 max-w-4xl mx-auto">
          {experienceList.map((exp, idx) => (
            <motion.div
              key={exp._id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline marker node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-[#0A0A0A] group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                <div className="h-1.5 w-1.5 rounded-full bg-white group-hover:bg-black transition-colors" />
              </div>

              {/* Card Container */}
              <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 sm:p-8 hover:border-white/15 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-white/[0.04]">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-accent font-bold flex items-center gap-1.5">
                      <Briefcase size={10} /> {exp.company}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-white mt-1">
                      {exp.role}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-white/40 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-white/30" /> {exp.startDate} — {exp.endDate || "Present"}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-white/30" /> {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans mb-5 max-w-2xl">
                    {exp.description}
                  </p>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="rounded-[3px] border border-white/[0.06] bg-[#050505] px-2.5 py-1 text-[10px] font-mono text-white/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
