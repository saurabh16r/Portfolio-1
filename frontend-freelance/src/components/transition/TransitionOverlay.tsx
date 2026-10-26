import { usePageTransition } from "./TransitionContext";
import { CurtainOverlay } from "./CurtainOverlay";
import { ShutterOverlay } from "./ShutterOverlay";
import { BlurOverlay } from "./BlurOverlay";

export function TransitionOverlay() {
  const { isTransitioning, stage, transitionType, destinationLabel } = usePageTransition();

  if (!isTransitioning || stage === "idle" || transitionType === "none") {
    return null;
  }

  return (
    <div
      id="cinematic-transition-layer"
      role="status"
      aria-live="polite"
      aria-busy={isTransitioning}
      className="fixed inset-0 z-[9990] select-none pointer-events-auto"
    >
      {/* Screen reader only announcement */}
      <span className="sr-only">Navigating to {destinationLabel}</span>

      {transitionType === "curtain" && (
        <CurtainOverlay stage={stage} destinationLabel={destinationLabel} />
      )}

      {transitionType === "shutters" && (
        <ShutterOverlay stage={stage} destinationLabel={destinationLabel} />
      )}

      {transitionType === "blur" && (
        <BlurOverlay stage={stage} destinationLabel={destinationLabel} />
      )}
    </div>
  );
}
