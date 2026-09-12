import { motion } from "framer-motion";

interface SkillTagProps {
  label: string;
}

export function SkillTag({ label }: SkillTagProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="inline-block rounded-full border border-white/5 bg-white/5 px-4 py-2 text-xs font-medium text-white transition-colors duration-300 hover:bg-white/10"
    >
      {label}
    </motion.span>
  );
}
