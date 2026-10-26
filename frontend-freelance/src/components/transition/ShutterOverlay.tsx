import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { TransitionStage } from "./types";
import { TransitionTypography } from "./TransitionTypography";

interface ShutterOverlayProps {
  stage: TransitionStage;
  destinationLabel: string;
}

export function ShutterOverlay({ stage, destinationLabel }: ShutterOverlayProps) {
  const isMobile = useIsMobile();
  const panelCount = isMobile ? 3 : 5;
  const panels = Array.from({ length: panelCount });

  const isEntering = stage === "entering";
  const isApex = stage === "apex";
  const isExiting = stage === "exiting";

  // Easing curve for cinematic acceleration
  const shutterEase = [0.76, 0, 0.24, 1] as const;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden pointer-events-auto">
      {/* Container for vertical shutter panels */}
      <div className="absolute inset-0 grid h-full w-full pointer-events-none" style={{ gridTemplateColumns: `repeat(${panelCount}, minmax(0, 1fr))` }}>
        {panels.map((_, index) => {
          // Stagger calculations
          // In: Stagger from left to right (0, 0.04, 0.08, 0.12, 0.16)
          // Out: Stagger from left to right or center-out
          const enterDelay = index * 0.045;
          const exitDelay = index * 0.045;

          const getY = () => {
            if (isEntering || isApex) return "0%";
            if (isExiting) return "-100%";
            return "100%";
          };

          const initialY = isExiting ? "0%" : "100%";

          return (
            <motion.div
              key={index}
              initial={{ y: initialY }}
              animate={{ y: getY() }}
              transition={{
                duration: isExiting ? 0.44 : 0.42,
                ease: shutterEase,
                delay: isExiting ? exitDelay : enterDelay,
              }}
              className="relative h-full w-full bg-[#0A0A0A] border-r border-white/[0.04] border-t border-accent/20 last:border-r-0"
              style={{
                backgroundImage: "linear-gradient(180deg, #121212 0%, #0A0A0A 100%)",
              }}
            >
              {/* Subtle vertical hairline highlight on panel edge */}
              <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {/* Signature Branding (Effect D) displayed over the panels once closed */}
      <TransitionTypography label={destinationLabel} isExiting={isExiting} />
    </div>
  );
}
