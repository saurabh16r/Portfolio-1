import React, { useState } from "react";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/common/SectionHeading";

export function TestimonialsSection() {
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Repeat testimonials list 4 times to guarantee full width coverage across ultra-wide viewports,
  // then double the array to facilitate a seamless loop animation.
  const baseRepeated = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];
  const doubledTestimonials = [...baseRepeated, ...baseRepeated];

  return (
    <section className="pt-0 pb-[120px] sm:pb-[140px] lg:pb-[160px] bg-transparent overflow-hidden">
      {/* Container header wrapper matching global alignment padding */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mb-16">
        <SectionHeading 
          eyebrow="Testimonials" 
          title="What People Say" 
          number="02" 
        />
      </div>

      {/* Full-width visual edge fade mask */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="ticker-mask py-4"
      >
        {/* Infinite scrolling animated track */}
        <div className="ticker-track">
          {doubledTestimonials.map((t, idx) => (
            <div
              key={idx}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredCardIdx(idx)}
              onMouseLeave={() => setHoveredCardIdx(null)}
              className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#0B0B0B] p-8 md:p-10 transition-colors duration-300 hover:border-white/[0.18] shrink-0 w-[300px] sm:w-[360px] md:w-[420px] select-none"
              style={{
                height: "auto",
              }}
            >
              {/* Card Spotlight */}
              {hoveredCardIdx === idx && (
                <div
                  className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(300px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.04), transparent 80%)`,
                  }}
                />
              )}

              <div className="flex flex-col gap-6 relative z-20">
                {/* Rating (minimal monochrome stars) */}
                <div className="text-white/40 text-xs tracking-wider">
                  {"★".repeat(t.rating)}
                </div>

                {/* Testimonial Quote */}
                <p className="text-sm md:text-base text-white/80 leading-relaxed font-light italic">
                  "{t.text}"
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 mt-8 relative z-20">
                {t.photo ? (
                  <img 
                    src={t.photo} 
                    alt={t.name} 
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-white/60">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-wider">{t.name}</h4>
                  <p className="text-[10px] text-white/40 mt-0.5 tracking-wide">
                    {t.position}, {t.company}
                  </p>
                  {t.project && (
                    <span className="inline-block text-[9px] text-white/30 mt-1 uppercase tracking-widest font-mono">
                      Project: {t.project}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
