import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { experience } from "@/data/experience";
import { useIsMobile } from "@/hooks/useMobile";

export function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Hook into timeline element scroll bounds
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Smooth physical spring to control progress filling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    mass: 0.2,
  });

  return (
    <div ref={containerRef} className="relative pl-7 sm:pl-12 md:pl-16 select-none w-full">
      {/* 1. Timeline Progress Rail Track (Ivory 15% opacity background) */}
      <div className="absolute left-[11px] sm:left-[15px] md:left-[19px] top-6 bottom-6 w-[2px] bg-[rgba(245,242,235,0.12)] rounded-full" />

      {/* 2. Animated Progress Line Filling Downward */}
      <motion.div
        style={{ scaleY: smoothProgress, transformOrigin: "top" }}
        className="absolute left-[11px] sm:left-[15px] md:left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-accent via-accent to-accent/20 origin-top z-10 rounded-full shadow-[0_0_8px_rgba(201,169,106,0.35)]"
      />

      {/* Compact vertical list */}
      <div className="space-y-8">
        {experience.map((item, idx) => {
          const isNodeGlowing = hoveredIdx === idx || item.active;

          return (
            <div key={idx} className="relative group w-full flex items-start">
              
              {/* Thin horizontal connecting blueprint line */}
              {!isMobile && (
                <div className="absolute right-full top-8 h-px bg-white/5 w-8 md:w-12 z-0 pointer-events-none" />
              )}

              {/* 3. Timeline Node Centered on Rail */}
              <div className="absolute left-[12px] sm:left-[16px] md:left-[20px] -translate-x-1/2 top-8 z-20 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  animate={isNodeGlowing ? {
                    scale: 1.15,
                    boxShadow: [
                      "0 0 8px rgba(201,169,106,0.25)",
                      "0 0 20px rgba(201,169,106,0.65)",
                      "0 0 8px rgba(201,169,106,0.25)"
                    ]
                  } : {
                    scale: 1,
                    boxShadow: "none"
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 260, damping: 15 },
                    boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className={`rounded-full flex items-center justify-center bg-black border ${
                    item.active
                      ? "w-8 h-8 border-accent"
                      : "w-5 h-5 border-white/20"
                  }`}
                >
                  {/* Inner Solid Dot */}
                  <div className={`rounded-full bg-accent ${item.active ? "w-2.5 h-2.5" : "w-1.5 h-1.5"}`} />
                </motion.div>
              </div>

              {/* 4. Compact Timeline Card */}
              <TimelineCard 
                item={item} 
                index={idx}
                onHoverStateChange={(hovered) => setHoveredIdx(hovered ? idx : null)}
              />

            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TimelineCardProps {
  item: typeof experience[number];
  index: number;
  onHoverStateChange: (hovered: boolean) => void;
}

function TimelineCard({ item, index, onHoverStateChange }: TimelineCardProps) {
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverStateChange(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverStateChange(false);
      }}
      initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      animate={{
        y: isHovered && !isMobile ? -5 : 0,
      }}
      transition={{ 
        y: { type: "spring", stiffness: 220, damping: 18 },
        default: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
      }}
      className={`relative w-full overflow-hidden rounded-[20px] bg-[#111111] p-5 sm:p-8 md:p-10 cursor-none border transition-colors duration-350 select-none ${
        item.active 
          ? "border-accent/35 shadow-[0_0_25px_rgba(201,169,106,0.03)]" 
          : "border-white/[0.08]"
      }`}
    >
      {/* Soft champagne glow behind active position */}
      {item.active && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(400px_circle_at_15%_25%,rgba(201,169,106,0.035),transparent_100%)] rounded-[20px] pointer-events-none" />
      )}

      {/* Left-edge Highlight line for active position */}
      {item.active && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent rounded-l-[20px]" />
      )}

      {/* Interactive boundary border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-[20px] border pointer-events-none z-20"
        animate={{
          borderColor: isHovered 
            ? item.active ? "rgba(201, 169, 106, 0.45)" : "rgba(255, 255, 255, 0.18)"
            : "rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Mouse spotlight overlay */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.04), transparent 85%)`,
          }}
        />
      )}

      {/* Details Container */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        
        {/* Top Row: Date period and Status Badge (Current, Internship, etc.) */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            {item.period}
          </span>
          {item.active ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/5 px-3 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-accent">
              <span className="h-1 w-1 rounded-full bg-accent animate-ping" /> Current
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">
              {item.type}
            </span>
          )}
        </div>

        {/* Company and Role Headers */}
        <div className="flex flex-col items-start">
          <h3 className="font-display font-medium text-xl md:text-2xl uppercase tracking-wider text-white">
            {item.company}
          </h3>
          <h4 className="text-[11px] text-[#8b8b8b] font-medium tracking-wide mt-1">
            {item.role}
          </h4>
        </div>

        {/* Short 1-2 line Description */}
        <p className="mt-4 text-[11px] leading-relaxed text-[#666] max-w-[500px]">
          {item.description}
        </p>

      </div>
    </motion.div>
  );
}
