import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProjectCard } from "@/components/common/ProjectCard";
import { api } from "@/services/api.js";
import { motion } from "framer-motion";

export function FeaturedWork() {
  const [allProjects, setAllProjects] = useState<any[]>(projects);

  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const live = await api.get("/case-studies?status=published&audience=job");
        if (live && live.length > 0) {
          setAllProjects(live);
        }
      } catch (err) {
        console.log("Could not load live projects, falling back to static copy.");
      }
    };
    fetchLiveProjects();
  }, []);

  const jobOrder = [
    "mamta-superspeciality-hospital",
    "royal-flosss",
    "dadi-sati-hospital",
    "finovo",
    "gattani-tiles",
    "bharosa-bhai",
    "deven"
  ];

  const filteredProjects = allProjects.filter((p) => !p.audience || p.audience === "job" || p.audience === "both");

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const idxA = jobOrder.indexOf(a.slug);
    const idxB = jobOrder.indexOf(b.slug);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  }).slice(0, 4);

  return (
    <section className="px-6 pt-0 pb-[180px] sm:px-8 lg:px-12 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading eyebrow="Portfolio" title="Selected Work" number="01" />
          
          <Link
            to="/work"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white border-b border-white/20 pb-1 hover:border-white transition-all cursor-none"
          >
            View All Projects <ArrowRight size={14} />
          </Link>
        </div>

        <motion.div 
          layout
          className="grid gap-6 md:grid-cols-2"
        >
          {sortedProjects.map((project) => (
            <motion.div
              layout
              key={project.slug}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
