import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { CardFooter } from "@/components/common/CardFooter";

interface ServiceCardProps {
  number: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  price: string;
}

export function ServiceCard({ number, icon: Icon, title, desc, price }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Tilt spring values
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-[6px] bg-card p-14 min-h-[520px] w-full border border-transparent select-none"
    >
      {/* Animated boundary border glow */}
      <motion.div
        className="absolute inset-0 rounded-[6px] border pointer-events-none z-20"
        animate={{
          borderColor: isHovered ? "rgba(201, 169, 106, 0.25)" : "rgba(255, 255, 255, 0.08)",
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Background Big Number */}
      <motion.div
        animate={{ opacity: isHovered ? 0.06 : 0.02 }}
        transition={{ duration: 0.3 }}
        className="absolute -right-6 -bottom-10 font-display font-medium text-[15rem] leading-none text-white select-none pointer-events-none z-0"
      >
        {number}
      </motion.div>

      {/* Dynamic Cursor Spotlight Overlay */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.045), transparent 85%)`,
          }}
        />
      )}

      {/* Card Content block */}
      <div className="relative z-10 flex flex-col h-full justify-between" style={{ transform: isMobile ? "none" : "translateZ(12px)" }}>
        {/* Upper Details block */}
        <div>
          <div className="flex items-center justify-between">
            <span className="font-display font-medium text-sm uppercase tracking-[0.3em] text-white/30">
              Service {number}
            </span>
            <motion.div
              animate={{ rotate: isHovered ? 12 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] text-white bg-white/[0.02]"
            >
              <Icon size={16} />
            </motion.div>
          </div>

          <motion.h3 
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="mt-12 font-display font-medium text-3xl uppercase tracking-[0.08em] text-white origin-left"
          >
            {title}
          </motion.h3>
          
          <p className="mt-5 text-xs leading-relaxed text-white/60 max-w-sm">
            {desc}
          </p>
        </div>

        <Link to="/contact" className="block mt-12">
          <CardFooter label={`Starting at ${price}`} isHovered={isHovered} />
        </Link>
      </div>
    </motion.div>
  );
}
