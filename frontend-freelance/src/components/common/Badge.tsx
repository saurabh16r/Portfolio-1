import { motion } from "framer-motion";

interface BadgeProps {
  label: string;
  glow?: boolean;
}

export function Badge({ label, glow = false }: BadgeProps) {
  return (
    <motion.span
      animate={{
        boxShadow: glow ? "0 0 12px rgba(201,169,106,0.15)" : "0 0 0px rgba(0,0,0,0)",
        borderColor: glow ? "rgba(201,169,106,0.3)" : "rgba(201,169,106,0.08)",
      }}
      transition={{ duration: 0.3 }}
      className="inline-block rounded-[4px] border border-accent/10 bg-accent/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-accent"
    >
      {label}
    </motion.span>
  );
}
