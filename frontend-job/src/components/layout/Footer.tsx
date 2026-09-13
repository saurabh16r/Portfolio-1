import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { navItems } from "@/data/navigation";
import { LuxuryButton } from "@/components/common/LuxuryButton";
import { Magnetic } from "@/components/common/Magnetic";
import LiquidFooterBackground from "@/components/LiquidFooterBackground";


export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-white/[0.04] bg-[#050505] px-6 py-12 sm:px-8 lg:px-12 relative overflow-hidden">
      <LiquidFooterBackground />
      <div className="relative mx-auto max-w-7xl z-10">
        {/* Immersive Cinematic CTA Section */}
        <div className="py-24 md:py-32 flex flex-col items-start text-left relative z-10 border-b border-white/[0.04] mb-12">
          {/* Ambient Lighting Shift */}
          <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
            <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-accent/8 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-1/3 left-[25%] -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-white/[0.015] blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
          </div>

          <h2 className="font-display font-medium text-[clamp(2.5rem,7.5vw,5.5rem)] uppercase leading-[1.0] tracking-tight text-white mb-14">
            {/* Row 1: LET'S CREATE */}
            <span className="block overflow-hidden h-[1.1em]">
              {"LET'S CREATE".split("").map((char, index) => (
                <motion.span
                  key={`let-${index}`}
                  initial={{ y: "105%", opacity: 0, rotate: 2 }}
                  whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.03,
                  }}
                  className="inline-block origin-bottom-left"
                  style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {/* Row 2: SOMETHING WORTH */}
            <span className="block overflow-hidden h-[1.1em] text-accent">
              {"SOMETHING WORTH".split("").map((char, index) => (
                <motion.span
                  key={`some-${index}`}
                  initial={{ y: "105%", opacity: 0, rotate: 2 }}
                  whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.25 + index * 0.03,
                  }}
                  className="inline-block origin-bottom-left"
                  style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {/* Row 3: EXPERIENCING. */}
            <span className="block overflow-hidden h-[1.1em]">
              {"EXPERIENCING.".split("").map((char, index) => (
                <motion.span
                  key={`exp-${index}`}
                  initial={{ y: "105%", opacity: 0, rotate: 2 }}
                  whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.5 + index * 0.03,
                  }}
                  className="inline-block origin-bottom-left"
                  style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h2>

          {/* Glow CTA Button */}
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-full bg-accent/25 opacity-30 blur-lg group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <LuxuryButton to="/contact" showArrow={true}>
              Get in Touch
            </LuxuryButton>
          </div>
        </div>

        {/* Footer Navigation Link Row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between border-b border-white/[0.04] pb-8 mb-8 z-10 relative">
          {/* Logo */}
          <Magnetic range={50} strength={0.25}>
            <Link to="/" className="font-display font-semibold text-[1.8rem] uppercase tracking-[0.35em] text-white block">
              S<span className="text-[#c0c0c0]">R</span>
            </Link>
          </Magnetic>

          {/* Navigation Links */}
          <ul className="flex flex-wrap gap-x-8 gap-y-4 text-[0.7rem] uppercase tracking-[0.25em]">
            <li>
              <Magnetic range={30} strength={0.3}>
                <Link to="/" className="text-white/40 transition-colors hover:text-white block py-1">
                  Home
                </Link>
              </Magnetic>
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
                <Magnetic range={30} strength={0.3}>
                  <Link to={item.href} className="text-white/40 transition-colors hover:text-white block py-1">
                    {item.label}
                  </Link>
                </Magnetic>
              </li>
            ))}
          </ul>

          {/* Back to Top */}
          <Magnetic range={50} strength={0.35}>
            <button
              onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] text-white/40 transition-colors hover:border-white/20 hover:text-white self-start md:self-auto cursor-none bg-transparent"
              type="button"
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </button>
          </Magnetic>
        </div>

        {/* Copyright & Social Row */}
        <div className="flex flex-col gap-4 text-xs text-[#666] sm:flex-row sm:items-center sm:justify-between z-10 relative">
          <p>© 2026 Saurabh Rathore. All rights reserved.</p>
          <div className="flex gap-6">
            <Magnetic range={40} strength={0.35}>
              <a
                href="https://www.linkedin.com/in/saurabh-singh-rathore-04a982332/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white block py-1"
              >
                LinkedIn
              </a>
            </Magnetic>
            <Magnetic range={40} strength={0.35}>
              <a
                href="https://www.behance.net/ankitrathore29"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white block py-1"
              >
                Behance
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </footer>
  );
}
