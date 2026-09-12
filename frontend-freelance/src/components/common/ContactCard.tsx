import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ContactCardProps {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
}

export function ContactCard({ label, value, href, icon: Icon }: ContactCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.15)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center gap-4 rounded-[6px] border border-white/[0.08] bg-[#111111] p-6 text-left hover:border-white/15 transition-all duration-300 w-full"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] text-white bg-white/[0.02]">
        <Icon size={16} />
      </div>
      <div>
        <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] block">{label}</span>
        <span className="text-sm font-semibold text-[#c0c0c0] hover:text-white transition-colors">{value}</span>
      </div>
    </motion.a>
  );
}
