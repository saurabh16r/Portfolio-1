import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Eye } from "lucide-react";
import { type Project } from "@/data/projects";

interface CaseStudyHeroProps {
  project: Project;
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  return (
    <section className="px-6 pb-20 pt-36 sm:px-8 lg:px-12 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#666] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Work
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[0.7rem] uppercase tracking-[0.35em] text-accent bg-accent/5 px-3 py-1.5 rounded-full border border-accent/10">
              {project.category}
            </span>
            <h1 className="mt-6 font-display font-medium text-[clamp(3.5rem,8vw,6.5rem)] uppercase leading-[0.88] tracking-tight text-white">
              {project.title}
            </h1>
            <p className="mt-8 text-xl leading-8 text-white max-w-2xl">{project.intro}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-[2rem] border border-white/10 bg-card p-8 h-fit self-center"
          >
            <h3 className="text-[0.7rem] uppercase tracking-[0.3em] text-[#666] mb-6">Details</h3>
            <div className="space-y-5 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-[#666]">Year</span>
                <span className="text-white font-medium">{project.year}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-[#666]">Role</span>
                <span className="text-white font-medium">{project.role}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-[#666]">Duration</span>
                <span className="text-white font-medium">{project.duration}</span>
              </div>
              <div className="pt-2 flex flex-wrap gap-4">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#c0c0c0] transition-colors"
                  >
                    Live <ExternalLink size={12} />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#c0c0c0] transition-colors"
                  >
                    GitHub <Github size={12} />
                  </a>
                )}
                {project.prototype && (
                  <a
                    href={project.prototype}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#c0c0c0] transition-colors"
                  >
                    Prototype <Eye size={12} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
