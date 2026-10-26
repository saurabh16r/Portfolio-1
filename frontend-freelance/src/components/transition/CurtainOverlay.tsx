import { motion } from "framer-motion";
import { TransitionStage } from "./types";
import { TransitionTypography } from "./TransitionTypography";

interface CurtainOverlayProps {
  stage: TransitionStage;
  destinationLabel: string;
}

export function CurtainOverlay({ stage, destinationLabel }: CurtainOverlayProps) {
  const isEntering = stage === "entering";
  const isApex = stage === "apex";
  const isExiting = stage === "exiting";

  // Coordinates:
  // Entering: from y: 100% to y: 0%
  // Apex: y: 0%
  // Exiting: from y: 0% to y: -100%
  const getTransformY = () => {
    if (isEntering) return "0%";
    if (isApex) return "0%";
    if (isExiting) return "-100%";
    return "100%";
  };

  const initialY = isExiting ? "0%" : "100%";

  return (
    <motion.div
      initial={{ y: initialY }}
      animate={{ y: getTransformY() }}
      transition={{
        duration: isExiting ? 0.44 : 0.42,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden bg-[#0A0A0A] border-t border-accent/25 shadow-[0_-1px_20px_rgba(201,169,106,0.12)]"
      style={{
        backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 50%, #141414 0%, #0A0A0A 100%)",
      }}
    >
      {/* Subtle fine geometric corner accents */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/10 pointer-events-none" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/10 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/10 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/10 pointer-events-none" />

      {/* Signature Branding (Effect D) */}
      <TransitionTypography label={destinationLabel} isExiting={isExiting} />
    </motion.div>
  );
}
