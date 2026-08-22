import { useEffect, useRef, useState } from "react";

// Extend window interface for Unicorn Studio SDK
interface UnicornStudioSDK {
  init: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioSDK;
  }
}

const UNICORN_STUDIO_SDK_URL = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.8/dist/unicornStudio.umd.js";

let isScriptLoadedGlobal = false;

function loadUnicornScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.UnicornStudio) {
      resolve();
      return;
    }

    // Check if the script tag is already in document to avoid duplicates
    const existingScript = document.querySelector(`script[src="${UNICORN_STUDIO_SDK_URL}"]`);
    if (existingScript) {
      if (isScriptLoadedGlobal) {
        resolve();
      } else {
        // Wait for existing script to load
        const interval = setInterval(() => {
          if (window.UnicornStudio) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = UNICORN_STUDIO_SDK_URL;
    script.async = true;
    script.onload = () => {
      isScriptLoadedGlobal = true;
      resolve();
    };
    script.onerror = (err) => {
      reject(err);
    };
    document.head.appendChild(script);
  });
}

export function LiquidHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [deviceScale, setDeviceScale] = useState("1.0");

  // Determine rendering parameters based on performance-sensitive constraints
  useEffect(() => {
    // 1. Accessibility: Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // 2. Responsiveness: Determine device scale on mount to avoid resize-triggered WebGL restarts
    const width = window.innerWidth;
    if (width < 768) {
      setDeviceScale("0.5"); // Mobile: lower resolution for optimal scrolling performance
    } else if (width < 1024) {
      setDeviceScale("0.75"); // Tablet: slight performance optimization
    } else {
      setDeviceScale("1.0"); // Desktop: full visual complexity and quality
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Initialize Unicorn Studio Scene
  useEffect(() => {
    // Skip interactive WebGL initialization if the user prefers reduced motion
    if (prefersReducedMotion) return;

    let isMounted = true;

    loadUnicornScript()
      .then(() => {
        if (!isMounted) return;

        // Initialize script. Note that Unicorn Studio searches for elements with `data-us-project`
        if (window.UnicornStudio && typeof window.UnicornStudio.init === "function") {
          window.UnicornStudio.init();
        }
      })
      .catch((err) => {
        console.error("Failed to load or initialize Unicorn Studio SDK:", err);
      });

    return () => {
      isMounted = false;
      // Clean up the WebGL contexts and canvas instances
      if (window.UnicornStudio && typeof window.UnicornStudio.destroy === "function") {
        try {
          window.UnicornStudio.destroy();
        } catch (e) {
          // Suppress errors during cleanup if elements are already unmounted
        }
      }
    };
  }, [prefersReducedMotion, deviceScale]);

  // If the user prefers reduced motion, render a clean static background to ensure readability and performance
  if (prefersReducedMotion) {
    return (
      <div 
        className="absolute inset-0 -z-20 bg-[#0A0A0A] pointer-events-none" 
        style={{ width: "100%", height: "100%" }}
      />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-20 bg-[#0A0A0A]">
      {/* 
        WebGL Canvas Container
        - pointer-events: none is critical to avoid block mouse interactions with Hero section content/links
        - data-us-fps="30" forces 30 FPS render loop for calmer motion and GPU efficiency
        - data-us-dpi="1" keeps standard device pixel ratio to stay lightweight
      */}
      <div
        ref={containerRef}
        data-us-project="3x7p91deSffTIZE2S4u3"
        data-us-fps="30"
        data-us-dpi="1"
        data-us-scale={deviceScale}
        data-us-lazyload="true"
        className="absolute inset-0 w-full h-full opacity-[0.35]"
        style={{ mixBlendMode: "screen" }}
      />

      {/* 
        Subtle dark gradient/overlay over the animation so that the hero typography remains highly readable.
        Fades the animation out near the edges and bottom to blend seamlessly into the #0A0A0A background.
      */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(circle at center, rgba(10, 10, 10, 0) 30%, rgba(10, 10, 10, 0.85) 85%, #0A0A0A 100%),
            linear-gradient(to bottom, rgba(10, 10, 10, 0) 60%, #0A0A0A 100%)
          `
        }}
      />
    </div>
  );
}
