import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { ArrowRight } from "lucide-react";

interface LuxuryButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  showArrow?: boolean;
  type?: "button" | "submit";
  href?: string;
}

export function LuxuryButton({
  children,
  to,
  onClick,
  className = "",
  showArrow = true,
  type = "button",
  href,
}: LuxuryButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Magnetic pull towards cursor
    setPosition({ x: x * 0.18, y: y * 0.18 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const btnContent = (
    <span className="flex items-center justify-center gap-2">
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <motion.span
          className="relative z-10"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowRight size={13} />
        </motion.span>
      )}
    </span>
  );

  const baseStyles = `relative inline-flex items-center justify-center rounded-full border border-white/8 bg-transparent px-[44px] h-[58px] text-[0.72rem] font-bold uppercase tracking-[0.25em] text-white overflow-hidden transition-colors duration-500 hover:border-accent/40 hover:text-accent select-none ${className}`;

  const motionWrapper = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.1 }}
      className="inline-block cursor-none"
    >
      <span className={baseStyles}>
        {/* Subtle hover background fill */}
        <motion.span
          className="absolute inset-0 bg-accent/5 opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        {btnContent}
      </span>
    </motion.div>
  );

  if (to) {
    return <Link to={to} className="cursor-none">{motionWrapper}</Link>;
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="cursor-none">
        {motionWrapper}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className="outline-none bg-transparent p-0 m-0 border-none inline-block cursor-none">
      {motionWrapper}
    </button>
  );
}
