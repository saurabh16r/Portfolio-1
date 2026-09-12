import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { LuxuryButton } from "@/components/common/LuxuryButton";
import { Magnetic } from "@/components/common/Magnetic";
import LiquidHeroBackground from "@/components/LiquidHeroBackground";

interface LineTextProps {
  text: string;
  delayOffset: number;
  isAccent?: boolean;
}


// Letter reveal with separation and settling into place
function LineText({ text, delayOffset, isAccent = false }: LineTextProps) {
  const words = text.split(" ");
  return (
    <span className={`block overflow-hidden py-1 ${isAccent ? "text-accent" : "text-white"}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, cIdx) => (
            <motion.span
              key={cIdx}
              initial={{
                opacity: 0,
                y: 80,
                filter: "blur(8px)",
                // Subtle horizontal separation: letters start spread out from word center
                x: (cIdx - word.length / 2) * 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                x: 0,
              }}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1], // premium custom ease
                delay: delayOffset + wIdx * 0.15 + cIdx * 0.04,
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function HomeHero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth custom spring mechanics for mouse parallax
  const springConfig = { stiffness: 90, damping: 20 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized cursor offset from screen center (-0.5 to 0.5)
      const xOffset = e.clientX / innerWidth - 0.5;
      const yOffset = e.clientY / innerHeight - 0.5;
      
      // Maximum displacement offset of 18px
      mouseX.set(xOffset * 18);
      mouseY.set(yOffset * 18);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative flex min-h-[85vh] items-center justify-start px-6 pb-20 pt-36 sm:px-8 lg:px-12 overflow-hidden bg-transparent">
      {/* Dynamic Liquid/3D Animated WebGL Background */}
      <LiquidHeroBackground />

      {/* Slow Shifting Ambient Background Light (Hero-specific) */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[25%] left-[15%] w-[350px] h-[350px] rounded-full bg-accent/5 blur-[100px]"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start text-left z-10">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/30 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent"></span>
          </span>
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/55 font-bold">
            Available for Q3 - Q4 projects
          </p>
        </motion.div>

        {/* Parallax-controlled Heading Wrapper */}
        <motion.h1
          style={{ x: parallaxX, y: parallaxY }}
          className="font-display font-medium text-[clamp(3.3rem,8vw,6.3rem)] uppercase leading-[0.9] tracking-tight text-white select-none text-left"
        >
          <LineText text="Digital Product" delayOffset={0.3} />
          <LineText text="Designer & Engineer" delayOffset={0.65} isAccent />
        </motion.h1>

        {/* Description Paragraph (48px spacing, 60-70 character width limit) */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1.15 }}
          className="mt-12 max-w-[550px] text-white/60 text-base sm:text-lg leading-relaxed font-sans text-left"
        >
          I shape high-converting websites and motion-first interfaces for high-growth startups and global brands.
        </motion.p>

        {/* Action buttons row with Magnetic pulls (64px spacing, 32px gap, stacks on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1.35 }}
          className="mt-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-8 w-full sm:w-auto"
        >
          <Magnetic range={55} strength={0.22}>
            <div className="w-full sm:w-auto">
              <LuxuryButton to="/work" className="w-full sm:w-auto">
                See My Work
              </LuxuryButton>
            </div>
          </Magnetic>

          <Magnetic range={55} strength={0.22}>
            <div className="w-full sm:w-auto">
              <LuxuryButton
                to="/contact"
                showArrow={false}
                className="border-white/5 hover:border-white/15 text-white/60 hover:text-white w-full sm:w-auto"
              >
                Start a Project
              </LuxuryButton>
            </div>
          </Magnetic>
        </motion.div>
      </div>

      {/* Scroll Indicator (Positioned at bottom center, isolated) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.8, duration: 1.0 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[0.55rem] uppercase tracking-[0.4em] text-white/30">Scroll</span>
        <div className="h-10 w-[1px] bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}
