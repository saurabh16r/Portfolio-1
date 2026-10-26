import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProjectCard } from "@/components/common/ProjectCard";
import { api } from "@/services/api.js";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import {
  sectionStaggerContainer,
  headingRevealVariants,
  ctaRevealVariants,
  cardRevealVariants,
} from "@/lib/motionVariants";

export function FeaturedWork() {
  const [allProjects, setAllProjects] = useState<any[]>(projects);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking for subtle editorial depth between columns
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Second column has a restrained -20px to +20px subtle editorial parallax on desktop
  const colOffset = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const live = await api.get("/case-studies?status=published&audience=freelance");
        if (live && live.length > 0) {
          setAllProjects(live);
        }
      } catch (err) {
        console.log("Could not load live projects, falling back to static copy.");
      }
    };
    fetchLiveProjects();
  }, []);

  const freelanceOrder = [
    "bharosa-bhai",
    "deven",
    "royal-flosss",
    "gattani-tiles",
    "mamta-superspeciality-hospital",
    "dadi-sati-hospital",
    "finovo",
  ];

  const filteredProjects = allProjects.filter(
    (p) => !p.audience || p.audience === "freelance" || p.audience === "both"
  );

  const sortedProjects = [...filteredProjects]
    .sort((a, b) => {
      const idxA = freelanceOrder.indexOf(a.slug);
      const idxB = freelanceOrder.indexOf(b.slug);
      if (idxA === -1 && idxB === -1) return 0;
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    })
    .slice(0, 4);

  return (
    <section ref={sectionRef} className="px-6 pt-0 pb-[180px] sm:px-8 lg:px-12 bg-transparent relative">
      {/* Subtle ambient gold glow in background */}
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-accent/[0.02] blur-[150px] -z-10"
      />

      <div className="mx-auto max-w-7xl">
        {/* Editorial Section Header */}
        <motion.div
          variants={sectionStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <motion.div variants={headingRevealVariants}>
            <SectionHeading eyebrow="Selected Cases" title="Featured Work" number="01" />
          </motion.div>

          <motion.div variants={ctaRevealVariants}>
            <Link
              to="/work"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white border-b border-white/20 pb-1 hover:border-white transition-all cursor-none group"
            >
              <span>View All Projects</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Editorial 2-Column Staggered Grid */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 items-start">
          {sortedProjects.map((project, idx) => {
            const isRightColumn = idx % 2 === 1;

            return (
              <motion.div
                key={project.slug}
                variants={cardRevealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.75,
                  delay: (idx % 2) * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  y: !isMobile && !shouldReduceMotion && isRightColumn ? colOffset : 0,
                }}
                className={isRightColumn ? "md:mt-8" : ""}
              >
                <ProjectCard project={project} index={idx} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
