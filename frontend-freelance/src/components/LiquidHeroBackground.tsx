import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";

interface UnicornStudioSDK {
  init: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioSDK;
  }
}

const SDK_URL = "https://cdn.unicorn.studio/v1.2.3/unicornStudio.umd.js";
let scriptLoadingPromise: Promise<void> | null = null;

function loadUnicornScript(): Promise<void> {
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise<void>((resolve, reject) => {
    if (window.UnicornStudio) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src="${SDK_URL}"]`);
    if (existingScript) {
      const checkLoaded = setInterval(() => {
        if (window.UnicornStudio) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = (err) => {
      scriptLoadingPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export default function LiquidHeroBackground() {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(true);
  const isMobile = useIsMobile();

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", listener);
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  // Monitor visibility of Hero area to pause rendering when out of view
  useEffect(() => {
    if (!outerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(outerRef.current);
    return () => observer.disconnect();
  }, []);

  // Progressive/idle loading and initialization of WebGL canvas
  useEffect(() => {
    if (prefersReducedMotion) return;

    let isCurrent = true;

    const bootUnicorn = () => {
      loadUnicornScript()
        .then(() => {
          if (!isCurrent) return;
          setIsLoaded(true);

          if (window.UnicornStudio && typeof window.UnicornStudio.init === "function") {
            window.UnicornStudio.init();
          }
        })
        .catch((err) => {
          console.error("Unicorn Studio script failed to load:", err);
        });
    };

    // Delay boot until main thread is idle to ensure immediate First Contentful Paint
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => bootUnicorn());
    } else {
      setTimeout(bootUnicorn, 150);
    }

    return () => {
      isCurrent = false;
      if (window.UnicornStudio && typeof window.UnicornStudio.destroy === "function") {
        try {
          window.UnicornStudio.destroy();
        } catch (e) {
          // Suppress errors during early unmounting
        }
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0 bg-[#0A0A0A] pointer-events-none"
        style={{ zIndex: 0 }}
      />
    );
  }

  return (
    <div
      ref={outerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#0A0A0A]"
      style={{ zIndex: 0 }}
    >
      {/* Unicorn Studio 3D Canvas wrapper */}
      <div
        ref={containerRef}
        data-us-project="3x7p91deSffTIZE2S4u3"
        data-us-dpi={isMobile ? "0.75" : "1"}
        data-us-scale="1"
        data-us-fps={isMobile ? "20" : "30"}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: isLoaded && inView ? 0.35 : 0,
          visibility: inView ? "visible" : "hidden",
          transition: "opacity 1.5s ease-in-out",
        }}
      />

      {/* Subtle gold accent overlay */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 1,
          background: `
            radial-gradient(
              circle at center,
              rgba(201, 169, 106, 0.06),
              transparent 55%
            ),
            rgba(10, 10, 10, 0.35)
          `,
        }}
      />
    </div>
  );
}
