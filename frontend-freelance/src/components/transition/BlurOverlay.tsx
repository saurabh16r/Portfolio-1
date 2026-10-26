import { motion } from "framer-motion";
import { TransitionStage } from "./types";
import { TransitionTypography } from "./TransitionTypography";

interface BlurOverlayProps {
  stage: TransitionStage;
  destinationLabel: string;
}

export function BlurOverlay({ stage, destinationLabel }: BlurOverlayProps) {
  const isEntering = stage === "entering";
  const isApex = stage === "apex";
  const isExiting = stage === "exiting";

  const isVisible = isEntering || isApex || isExiting;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible && !isExiting ? 1 : isExiting ? 0 : 0,
      }}
      transition={{
        duration: isExiting ? 0.28 : 0.25,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden bg-[#0A0A0A]/85 backdrop-blur-[10px]"
    >
      {/* Subtle restrained editorial typography */}
      <TransitionTypography label={destinationLabel} isExiting={isExiting} />
    </motion.div>
  );
}
