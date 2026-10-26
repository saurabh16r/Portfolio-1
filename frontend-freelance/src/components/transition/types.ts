export type TransitionType = "curtain" | "shutters" | "blur" | "none";

export type TransitionStage = "idle" | "entering" | "apex" | "exiting";

export interface TransitionContextValue {
  /** Whether a page transition sequence is currently in progress */
  isTransitioning: boolean;
  /** Current stage of the transition animation lifecycle */
  stage: TransitionStage;
  /** Active transition effect type */
  transitionType: TransitionType;
  /** The destination path being navigated to */
  targetPath: string | null;
  /** Editorial label for destination (e.g., 'SELECTED WORK', 'CASE STUDY') */
  destinationLabel: string;
  /** Programmatically trigger a transition navigation */
  navigateWithTransition: (to: string, customType?: TransitionType) => void;
}
