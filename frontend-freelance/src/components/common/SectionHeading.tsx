import { useState } from "react";
import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  number: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, number, className = "" }: SectionHeadingProps) {
  const [isHovered, setIsHovered] = useState(false);

  const words = title.split(" ");
  
  // Wave transition animation for characters
  const charVariants = {
    initial: { y: 0 },
    hovered: (i: number) => ({
      y: [0, -4, 3, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        delay: i * 0.025,
      },
    }),
  };

  return (
    <div 
      className={`select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Number */}
      <div className="mb-2 font-display font-medium text-[10px] uppercase tracking-[0.35em] text-white/20">
        {number}
      </div>
      
      {/* Eyebrow */}
      <p className="mb-6 text-[10px] uppercase tracking-[0.35em] text-[#666]">{eyebrow}</p>
      
      {/* Title with Interactive Typography */}
      <motion.h2 
        animate={{
          scale: isHovered ? 1.015 : 1,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="font-display font-medium text-[clamp(2.5rem,5vw,3.5rem)] uppercase leading-none text-white block cursor-none"
      >
        {words.map((word, wIdx) => {
          const isLastWord = wIdx === words.length - 1;
          const charOffsetBase = words.slice(0, wIdx).join("").length;

          return (
            <span 
              key={wIdx} 
              className={`inline-block mr-[0.25em] transition-all duration-350 ${
                isLastWord ? "text-accent" : "text-white"
              }`}
              style={{
                letterSpacing: isHovered ? "0.08em" : "0em",
              }}
            >
              {word.split("").map((char, cIdx) => {
                const absoluteCharIndex = charOffsetBase + cIdx;
                return (
                  <motion.span
                    key={cIdx}
                    custom={absoluteCharIndex}
                    variants={charVariants}
                    animate={isHovered ? "hovered" : "initial"}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </motion.h2>
    </div>
  );
}
