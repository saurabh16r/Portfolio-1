import { motion } from "framer-motion";

interface TransitionTypographyProps {
  label: string;
  isExiting: boolean;
}

export function TransitionTypography({ label, isExiting }: TransitionTypographyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 0.98 : 1,
      }}
      transition={{
        duration: isExiting ? 0.22 : 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative z-30 flex flex-col items-center justify-center text-center select-none pointer-events-none px-6"
    >
      {/* Signature SR Wordmark (Effect D) */}
      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{
          y: isExiting ? -10 : 0,
          opacity: isExiting ? 0 : 1,
        }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
          delay: isExiting ? 0 : 0.05,
        }}
        className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.4em] text-[#F5F2EB] flex items-center pl-[0.4em]"
      >
        <span>S</span>
        <span className="text-accent ml-0.5">R</span>
      </motion.div>

      {/* Gold Accent Line (Effect D) */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isExiting ? 0 : 72,
          opacity: isExiting ? 0 : 0.85,
        }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
          delay: isExiting ? 0 : 0.1,
        }}
        className="h-[1.5px] bg-accent my-3.5 rounded-full"
      />

      {/* Editorial Destination Subtitle */}
      <motion.span
        initial={{ y: 8, opacity: 0 }}
        animate={{
          y: isExiting ? 6 : 0,
          opacity: isExiting ? 0 : 1,
        }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
          delay: isExiting ? 0 : 0.15,
        }}
        className="text-[9px] sm:text-[10px] font-sans font-medium uppercase tracking-[0.35em] text-[#F5F2EB]/50"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
