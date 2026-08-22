import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface QuoteSectionProps {
  number: string;
  label: string;
  quote: string;
  accentWord: string;
  author: string;
  variant?: "left" | "offset" | "minimal";
}

export function QuoteSection({
  number,
  label,
  quote,
  accentWord,
  author,
  variant = "left"
}: QuoteSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking for parallax and traveling dot
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Smooth parallax offsets
  const parallaxBgY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const parallaxTextY = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  const smoothBgY = useSpring(parallaxBgY, { stiffness: 90, damping: 30 });
  const smoothTextY = useSpring(parallaxTextY, { stiffness: 90, damping: 30 });

  // Traveling dot animation along the top line
  const dotX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Staggered reveal animations when section scrolls into view
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const labelVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 0.4,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const bgDecorationVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1, // Will be controlled via inline element opacity styles
      scale: 1,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const authorVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 0.3, // Muted
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const accentColorVariants = {
    hidden: { color: "#F5F2EB" },
    visible: {
      color: "#C9A96A",
      transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.5 }
    }
  };

  // Split quote and highlight target accent word
  const renderQuoteText = (text: string, accent: string) => {
    const words = text.split(" ");
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""'']/g, "");
      const isAccent = cleanWord.toLowerCase() === accent.toLowerCase();
      if (isAccent) {
        return (
          <motion.span
            key={idx}
            variants={accentColorVariants}
            className="font-semibold transition-colors duration-300"
          >
            {word}{idx < words.length - 1 ? " " : ""}
          </motion.span>
        );
      }
      return <span key={idx}>{word}{idx < words.length - 1 ? " " : ""}</span>;
    });
  };

  // Variant classes configuration
  let alignmentClass = "items-start text-left";
  let contentWidthClass = "max-w-5xl";
  if (variant === "offset") {
    alignmentClass = "items-start text-left md:items-end md:text-left md:ml-auto";
    contentWidthClass = "max-w-4xl";
  } else if (variant === "minimal") {
    alignmentClass = "items-center text-center mx-auto";
    contentWidthClass = "max-w-4xl";
  }

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-20 md:py-[120px] lg:py-[160px] bg-[#0A0A0A] overflow-hidden select-none group w-full flex flex-col justify-center"
    >
      {/* Top horizontal divider with traveling dot */}
      <div className="mx-auto max-w-5xl w-full relative mb-12">
        <div className="w-full h-px bg-white/[0.06] relative">
          {!shouldReduceMotion && (
            <motion.div
              style={{ left: dotX }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C9A96A]"
            />
          )}
        </div>
      </div>

      {/* Subtle radial glow background overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] transition-opacity duration-700"
        style={{
          background: "radial-gradient(600px circle at 50% 50%, rgba(201, 169, 106, 0.15), transparent 80%)"
        }}
      />

      {/* Faint grain background texture */}
      <div className="absolute inset-0 pointer-events-none noise-overlay opacity-[0.012]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        className={`mx-auto w-full relative z-10 flex flex-col ${alignmentClass} ${contentWidthClass}`}
      >
        {/* Section Label */}
        <motion.div
          variants={labelVariants}
          className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-6"
        >
          {number} — {label}
        </motion.div>

        {/* Quote Content Block */}
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : smoothTextY }}
          className="relative py-4 w-full"
        >
          {/* Background decoration: Large Quote Mark or Faint Number */}
          {variant !== "minimal" && (
            <motion.div
              variants={bgDecorationVariants}
              style={{ y: shouldReduceMotion ? 0 : smoothBgY }}
              className="absolute pointer-events-none select-none font-serif font-black text-[#C9A96A] leading-none"
            >
              {variant === "offset" ? (
                <span className="absolute text-[12rem] md:text-[20rem] -top-16 -left-4 md:-top-28 md:-left-8 opacity-[0.025]">
                  {number}
                </span>
              ) : (
                <span className="absolute text-[16rem] md:text-[26rem] -top-20 -left-6 md:-top-32 md:-left-12 opacity-[0.035]">
                  “
                </span>
              )}
            </motion.div>
          )}

          {/* Quote Text */}
          <motion.blockquote
            variants={textVariants}
            className="font-display font-medium text-[clamp(1.5rem,3.8vw,2.6rem)] uppercase leading-[1.3] tracking-wide text-white/95 break-words relative z-10"
          >
            “{renderQuoteText(quote, accentWord)}”
          </motion.blockquote>
        </motion.div>

        {/* Quote Author */}
        {author && (
          <motion.cite
            variants={authorVariants}
            className="block mt-6 not-italic text-[10px] md:text-xs tracking-widest uppercase text-white/30 font-semibold font-sans"
          >
            — {author}
          </motion.cite>
        )}
      </motion.div>

      {/* Bottom horizontal divider line */}
      <div className="mx-auto max-w-5xl w-full relative mt-16">
        <div className="w-full h-px bg-white/[0.06]" />
      </div>
    </section>
  );
}
