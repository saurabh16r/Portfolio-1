import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type Project } from "@/data/projects";
import { useIsMobile } from "@/hooks/useMobile";
import { Badge } from "@/components/common/Badge";
import { CardFooter } from "@/components/common/CardFooter";
import { getImageUrl } from "@/services/api";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Tilt spring values for 3D physics feel
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateXSpring = useSpring(x, { damping: 25, stiffness: 220 });
  const rotateYSpring = useSpring(y, { damping: 25, stiffness: 220 });

  // Perspective tilt of maximum 3.5 degrees
  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], [-3.5, 3.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(relativeY);
    y.set(relativeX);
    
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      animate={{
        y: isHovered && !isMobile ? -10 : 0,
      }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[6px] bg-card p-5 sm:p-6 md:p-8 lg:p-10 cursor-none w-full lg:aspect-[16/14] border border-transparent"
      data-cursor="project"
      data-cursor-text="VIEW"
    >
      {/* Animated boundary border glow */}
      <motion.div
        className="absolute inset-0 rounded-[6px] border pointer-events-none z-20"
        animate={{
          borderColor: isHovered ? "rgba(201, 169, 106, 0.25)" : "rgba(255, 255, 255, 0.08)",
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Dynamic Cursor Spotlight Overlay */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.05), transparent 85%)`,
          }}
        />
      )}

      {/* Full card clickable link wrapper */}
      <Link
        to={`/work/${project.slug}`}
        className="flex w-full lg:h-full flex-col justify-between z-10"
        style={{ transform: isMobile ? "none" : "translateZ(15px)" }}
      >
        {/* Upper Preview Image: Responsive aspect ratio on mobile, 64% height on desktop */}
        <div className="w-full aspect-[16/9] sm:aspect-[16/10] lg:aspect-none lg:h-[62%] overflow-hidden rounded-[4px] border border-white/5 relative shrink-0">
          <motion.div
            animate={{ scale: isHovered ? 1.07 : 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getImageUrl(project.image, 800)})` }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Lower Project Details */}
        <div className="mt-4 sm:mt-5 lg:mt-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <Badge label={project.category} glow={isHovered} />
              {project.technologies && project.technologies.slice(0, 2).map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-[3px] border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] font-mono text-white/50 uppercase tracking-wider"
                >
                  {tech}
                </span>
              ))}
              <span className="ml-auto text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">
                {project.year}
              </span>
            </div>
            
            {/* Responsive project title */}
            <motion.h3 
              animate={{ y: isHovered ? -4 : 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="mt-3 font-display font-medium text-[clamp(1.3rem,4.5vw,2rem)] lg:text-3xl uppercase tracking-[0.04em] sm:tracking-[0.06em] leading-[1.1] text-white origin-left"
            >
              {project.title}
            </motion.h3>

            <p className="mt-2 text-xs text-white/60 leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>

          <div className="mt-4 sm:mt-5 lg:mt-6">
            <CardFooter label="View Case Study" isHovered={isHovered} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
