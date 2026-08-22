import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CardFooterProps {
  label: string;
  isHovered: boolean;
}

export function CardFooter({ label, isHovered }: CardFooterProps) {
  return (
    <div className="flex w-full items-center justify-between border-t border-white/5 pt-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white select-none">
      <span>{label}</span>
      <div className="relative w-4 h-4 overflow-hidden flex items-center justify-center">
        {/* Cinematic slide-out, warp, slide-in arrow */}
        <motion.span
          animate={isHovered ? {
            x: [0, 20, -20, 0],
            opacity: [1, 0, 0, 1],
          } : {
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.45,
            ease: "easeInOut",
            times: [0, 0.4, 0.45, 1],
          }}
        >
          <ArrowRight size={14} className="text-[#8b8b8b] group-hover:text-white transition-colors duration-300" />
        </motion.span>
      </div>
    </div>
  );
}
