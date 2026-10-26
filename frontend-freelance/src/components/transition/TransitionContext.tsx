import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetScrollToTop } from "@/components/layout/SmoothScroll";
import { TransitionContextValue, TransitionStage, TransitionType } from "./types";

const TransitionContext = createContext<TransitionContextValue | null>(null);

function getEditorialLabel(pathname: string): string {
  const cleanPath = pathname.split("?")[0].split("#")[0];
  if (cleanPath === "/") return "INDEX";
  if (cleanPath === "/work") return "SELECTED WORK";
  if (cleanPath.startsWith("/work/")) return "CASE STUDY";
  if (cleanPath === "/services") return "CAPABILITIES";
  if (cleanPath === "/pricing") return "ENGAGEMENT & INVESTMENT";
  if (cleanPath === "/contact") return "START A CONVERSATION";
  if (cleanPath === "/writing") return "ESSAYS & PERSPECTIVES";
  if (cleanPath.startsWith("/writing/")) return "READING";
  if (cleanPath === "/about") return "ABOUT & PHILOSOPHY";
  return "DESIGNING WHAT'S NEXT";
}

function resolveTransitionType(fromPath: string, toPath: string, reducedMotion: boolean): TransitionType {
  if (reducedMotion) return "none";

  const cleanFrom = fromPath.split("?")[0].split("#")[0];
  const cleanTo = toPath.split("?")[0].split("#")[0];

  // Admin and studio routes bypass cinematic transitions
  if (
    cleanTo.startsWith("/studio") ||
    cleanTo.startsWith("/admin") ||
    cleanFrom.startsWith("/studio") ||
    cleanFrom.startsWith("/admin")
  ) {
    return "none";
  }

  // Same route (or hash-only change)
  if (cleanFrom === cleanTo) {
    return "none";
  }

  const isToCaseStudy = /^\/work\/[^/]+$/.test(cleanTo);
  const isFromCaseStudy = /^\/work\/[^/]+$/.test(cleanFrom);

  // Scenario 3: Opening a project or case study -> Staggered shutters (Effect B + D)
  if (isToCaseStudy && cleanFrom !== cleanTo) {
    return "shutters";
  }

  // Scenario 4: Returning from a case study -> Short blur + fade (Effect C)
  if (isFromCaseStudy && (cleanTo === "/work" || cleanTo === "/")) {
    return "blur";
  }

  // Scenario 2: Main navigation between public pages -> Curtain reveal (Effect A + D)
  return "curtain";
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stage, setStage] = useState<TransitionStage>("idle");
  const [transitionType, setTransitionType] = useState<TransitionType>("curtain");
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [destinationLabel, setDestinationLabel] = useState("DESIGNING WHAT'S NEXT");

  const isInitialMount = useRef(true);
  const currentPathRef = useRef(location.pathname);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isNavigatingRef = useRef(false);

  // Track reduced motion preference
  const isReducedMotion = useRef(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotion.current = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion.current = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Keep currentPathRef synced
  useEffect(() => {
    currentPathRef.current = location.pathname;
  }, [location.pathname]);

  // Primary transition runner
  const navigateWithTransition = useCallback(
    (to: string, customType?: TransitionType) => {
      // Guard against race conditions and rapid multi-clicks
      if (isNavigatingRef.current) {
        return;
      }

      const currentPath = currentPathRef.current;
      const cleanCurrent = currentPath.split("?")[0].split("#")[0];
      const cleanTarget = to.split("?")[0].split("#")[0];

      // If navigation is to the exact same page, ignore
      if (cleanCurrent === cleanTarget && !to.includes("#")) {
        return;
      }

      // Check reduced motion
      const type = customType ?? resolveTransitionType(currentPath, to, isReducedMotion.current);

      if (type === "none") {
        navigate(to);
        resetScrollToTop();
        return;
      }

      isNavigatingRef.current = true;
      setIsTransitioning(true);
      setTransitionType(type);
      setTargetPath(to);
      setDestinationLabel(getEditorialLabel(to));
      setStage("entering");

      clearAllTimeouts();

      // Configure animation durations based on transition style
      const enterDuration = type === "shutters" ? 480 : type === "blur" ? 250 : 420;
      const apexHoldDuration = type === "shutters" ? 180 : type === "blur" ? 120 : 160;
      const exitDuration = type === "shutters" ? 480 : type === "blur" ? 280 : 440;

      // Enter Phase -> Apex
      const enterTimer = setTimeout(() => {
        setStage("apex");

        // Execute route change and reset scroll cleanly behind opaque overlay
        navigate(to);
        resetScrollToTop();

        // Apex Hold -> Exit Phase
        const apexTimer = setTimeout(() => {
          setStage("exiting");

          // Exit Phase -> Idle
          const exitTimer = setTimeout(() => {
            setStage("idle");
            setIsTransitioning(false);
            setTargetPath(null);
            isNavigatingRef.current = false;
          }, exitDuration);

          timeoutsRef.current.push(exitTimer);
        }, apexHoldDuration);

        timeoutsRef.current.push(apexTimer);
      }, enterDuration);

      timeoutsRef.current.push(enterTimer);
    },
    [navigate, clearAllTimeouts]
  );

  // Global click interception for internal links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Do not intercept if default is prevented, right click, or modifier keys held
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Ignore external, protocol-specific, or new tab links
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.rel.includes("external") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      // Check if href is an external domain
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) {
          return;
        }

        // Internal section anchor on the exact same page: do not intercept
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search &&
          url.hash
        ) {
          return;
        }

        // Element opt-out attribute
        if (anchor.hasAttribute("data-no-transition")) {
          return;
        }

        // Allowed internal navigation
        e.preventDefault();

        // Read optional custom transition override attribute
        const customTypeAttr = anchor.getAttribute("data-transition") as TransitionType | null;
        const targetRoute = `${url.pathname}${url.search}${url.hash}`;

        navigateWithTransition(targetRoute, customTypeAttr || undefined);
      } catch (err) {
        // Fallback for relative or malformed URLs
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [navigateWithTransition]);

  // Support browser Back/Forward (popstate) navigation
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // If location changed while not in an active transition, it was initiated by browser back/forward
    if (!isNavigatingRef.current) {
      const prevPath = currentPathRef.current;
      const newPath = location.pathname;

      if (prevPath !== newPath) {
        const type = resolveTransitionType(prevPath, newPath, isReducedMotion.current);
        if (type !== "none") {
          // Play a smooth exit reveal so history navigation matches the cinematic visual standard
          setIsTransitioning(true);
          setTransitionType(type);
          setDestinationLabel(getEditorialLabel(newPath));
          setStage("apex");
          resetScrollToTop();

          const exitTimer = setTimeout(() => {
            setStage("exiting");
            const completeTimer = setTimeout(() => {
              setStage("idle");
              setIsTransitioning(false);
            }, type === "blur" ? 280 : 420);
            timeoutsRef.current.push(completeTimer);
          }, 80);

          timeoutsRef.current.push(exitTimer);
        }
      }
    }
  }, [location.pathname]);

  const value: TransitionContextValue = {
    isTransitioning,
    stage,
    transitionType,
    targetPath,
    destinationLabel,
    navigateWithTransition,
  };

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a TransitionProvider");
  }
  return context;
}
