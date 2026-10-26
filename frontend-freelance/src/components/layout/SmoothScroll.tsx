import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

// Module-level singleton state
let globalLenis: Lenis | null = null;
let activeMounts = 0;
let rafId: number | null = null;
let destroyTimeout: ReturnType<typeof setTimeout> | null = null;

function checkReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Initializes or re-activates the shared singleton Lenis instance.
 */
function initLenis(): Lenis {
  if (globalLenis) {
    if (destroyTimeout) {
      clearTimeout(destroyTimeout);
      destroyTimeout = null;
    }
    // Make sure it's active
    globalLenis.start();
    return globalLenis;
  }

  const isReducedMotion = checkReducedMotion();

  const lenis = new Lenis({
    // Optimal 1.15s duration gives physical weight without lag
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    // When reduced motion is preferred, disable wheel smoothing
    smoothWheel: !isReducedMotion,
    wheelMultiplier: 0.95,
    // Critical: syncTouch: false ensures touch scrolling remains 100% native on iOS and Android
    syncTouch: false,
    touchMultiplier: 1.0,
    autoResize: true,
  });

  globalLenis = lenis;
  window.__lenis = lenis;

  function raf(time: number) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  // Resize when DOM tree updates
  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);
  }

  return lenis;
}

/**
 * Cleanly releases an active consumer. Destroys after a brief grace period to allow
 * consecutive page mounts to seamlessly reuse the instance without teardown lag.
 */
function releaseLenis() {
  activeMounts = Math.max(0, activeMounts - 1);
  if (activeMounts === 0) {
    if (destroyTimeout) clearTimeout(destroyTimeout);
    destroyTimeout = setTimeout(() => {
      if (activeMounts === 0 && globalLenis) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        globalLenis.destroy();
        globalLenis = null;
        if (window.__lenis) {
          window.__lenis = null;
        }
      }
    }, 400); // 400ms grace period covers route transition handoffs
  }
}

/**
 * Resets both Lenis smooth scroll and native window scroll instantly to top (0, 0).
 * Ideal for coordinating at the apex of page transitions.
 */
export function resetScrollToTop() {
  if (typeof window !== "undefined") {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }
}

/**
 * Smoothly scrolls to an element or selector using Lenis.
 */
export function scrollToElement(target: string | HTMLElement, offset: number = -70) {
  if (typeof window !== "undefined" && window.__lenis) {
    window.__lenis.scrollTo(target, { offset, duration: 1.15 });
  } else if (typeof document !== "undefined") {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}

export function SmoothScroll() {
  useEffect(() => {
    activeMounts++;
    const lenis = initLenis();

    // Handle hash anchor links globally without layout collisions
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, { offset: -70, duration: 1.15 });
          // Update URL hash without jumping
          if (history.pushState) {
            history.pushState(null, "", href);
          }
        }
      }
    };

    // Watch for reduced-motion system preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (globalLenis) {
        // Toggle smooth wheel based on system preference
        (globalLenis.options as any).smoothWheel = !e.matches;
      }
    };

    document.addEventListener("click", handleAnchorClick, false);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      document.removeEventListener("click", handleAnchorClick, false);
      mediaQuery.removeEventListener("change", handleMotionChange);
      releaseLenis();
    };
  }, []);

  return null;
}
