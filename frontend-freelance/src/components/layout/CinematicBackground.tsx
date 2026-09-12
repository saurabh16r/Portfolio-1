import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function CinematicBackground() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook into the page scroll progress
  const { scrollY } = useScroll();
  
  // Transform values for scroll parallax on background grid and ambient lighting
  const gridY = useTransform(scrollY, [0, 2000], [0, -100]);
  const gridRotate = useTransform(scrollY, [0, 2000], [65, 55]);
  const lightY = useTransform(scrollY, [0, 2000], [0, 150]);

  // Smooth out scroll transformations using springs
  const springConfig = { stiffness: 90, damping: 25, mass: 0.5 };
  const smoothGridY = useSpring(gridY, springConfig);
  const smoothGridRotate = useSpring(gridRotate, springConfig);
  const smoothLightY = useSpring(lightY, springConfig);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      containerRef.current.style.setProperty("--bg-mouse-x", x.toFixed(4));
      containerRef.current.style.setProperty("--bg-mouse-y", y.toFixed(4));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Generate metadata for 12 ambient particles
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const size = Math.random() * 3 + 1; // 1px to 4px
    const initialX = Math.random() * 100; // % values
    const initialY = Math.random() * 100;
    const duration = Math.random() * 30 + 30; // 30s to 60s
    const delay = Math.random() * -20; // negative delay so they start immediately mid-flight
    return { size, initialX, initialY, duration, delay, id: i };
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-50 overflow-hidden pointer-events-none bg-[#0A0A0A]"
      style={{
        "--bg-mouse-x": "0",
        "--bg-mouse-y": "0",
      } as React.CSSProperties}
    >
      {/* Subtle Diagonal Texture */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.002) 0px, rgba(255, 255, 255, 0.002) 1px, transparent 1px, transparent 10px)`
        }}
      />

      {/* Volumetric Radial Light Spheres (Slow-moving & Scroll Parallax) */}
      <motion.div 
        style={{ y: smoothLightY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[15%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-white/[0.012] blur-[160px] animate-pulse" style={{ animationDuration: '28s' }} />
        <div className="absolute bottom-[20%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-white/[0.008] blur-[180px] animate-pulse" style={{ animationDuration: '34s' }} />
      </motion.div>

      {/* Dynamic Mouse Light Spotlight */}
      {!isMobile && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle 800px at calc(50% + var(--bg-mouse-x) * 140px) calc(50% + var(--bg-mouse-y) * 140px), rgba(255, 255, 255, 0.015) 0%, transparent 100%)`
          }}
        />
      )}

      {/* Film Grain Noise overlay */}
      <div className="noise-overlay absolute inset-[-10%] w-[120%] h-[120%] opacity-[0.02]" />

      {/* Infinite Perspective Grid (Scroll Parallax Warp) */}
      <motion.div 
        style={{ 
          y: smoothGridY,
          rotateX: smoothGridRotate,
        }}
        className="absolute bottom-0 left-[-20%] right-[-20%] h-[50vh] opacity-[0.03] overflow-hidden origin-center-bottom"
      >
        <div className="perspective-grid absolute inset-0" />
      </motion.div>

      {/* Vignette & Fog covering the grid */}
      <div className="vignette-overlay absolute inset-0" />
      <div
        className="absolute bottom-0 left-0 right-0 h-[35vh]"
        style={{
          background: "linear-gradient(to top, #0A0A0A, transparent)"
        }}
      />

      {/* Floating Particles (Dust Motes) */}
      {!isMobile && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.initialX}%`,
            top: `${p.initialY}%`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, 40, 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
