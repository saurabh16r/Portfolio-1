import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Briefcase, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProjectCard } from "@/components/common/ProjectCard";
import { api } from "@/services/api.js";
import { motion } from "framer-motion";

export function FeaturedWork() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"job" | "freelance">(() => {
    return searchParams.get("view") === "freelance" ? "freelance" : "job";
  });
  
  const [allProjects, setAllProjects] = useState<any[]>(projects);

  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const live = await api.get("/case-studies?status=published");
        if (live && live.length > 0) {
          setAllProjects(live);
        }
      } catch (err) {
        console.log("Could not load live projects, falling back to static copy.");
      }
    };
    fetchLiveProjects();
  }, []);

  // Update URL search parameters when view mode changes
  const handleToggleView = (mode: "job" | "freelance") => {
    setViewMode(mode);
    setSearchParams((prev) => {
      prev.set("view", mode);
      return prev;
    });
  };

  const jobOrder = [
    "mamta-superspeciality-hospital",
    "royal-flosss",
    "dadi-sati-hospital",
    "finovo",
    "gattani-tiles",
    "bharosa-bhai",
    "deven"
  ];

  const freelanceOrder = [
    "bharosa-bhai",
    "deven",
    "royal-flosss",
    "gattani-tiles",
    "mamta-superspeciality-hospital",
    "dadi-sati-hospital",
    "finovo"
  ];

  // Dynamically sort and slice the projects based on active view mode
  const sortedProjects = [...allProjects].sort((a, b) => {
    const orderList = viewMode === "freelance" ? freelanceOrder : jobOrder;
    const idxA = orderList.indexOf(a.slug);
    const idxB = orderList.indexOf(b.slug);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  }).slice(0, 4);

  return (
    <section className="px-6 pt-0 pb-[180px] sm:px-8 lg:px-12 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading eyebrow="Selected Cases" title="Featured Work" number="01" />
          
          <Link
            to={`/work?view=${viewMode}`}
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white border-b border-white/20 pb-1 hover:border-white transition-all cursor-none"
          >
            View All Projects <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dynamic Context Selector Toggle */}
        <div className="flex justify-start mb-10">
          <div className="rounded-full border border-white/10 bg-white/[0.02] p-1 inline-flex gap-1 backdrop-blur-md">
            <button
              onClick={() => handleToggleView("job")}
              className={`relative rounded-full px-4 py-2 text-[10px] uppercase font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-none select-none ${
                viewMode === "job" ? "text-black z-10" : "text-white/60 hover:text-white"
              }`}
            >
              {viewMode === "job" && (
                <motion.div
                  layoutId="activeFeaturedTabBg"
                  className="absolute inset-0 bg-white rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Briefcase size={12} />
              Job-Seeking Focus
            </button>
            <button
              onClick={() => handleToggleView("freelance")}
              className={`relative rounded-full px-4 py-2 text-[10px] uppercase font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-none select-none ${
                viewMode === "freelance" ? "text-black z-10" : "text-white/60 hover:text-white"
              }`}
            >
              {viewMode === "freelance" && (
                <motion.div
                  layoutId="activeFeaturedTabBg"
                  className="absolute inset-0 bg-white rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Rocket size={12} />
              Freelance / Startup Focus
            </button>
          </div>
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
