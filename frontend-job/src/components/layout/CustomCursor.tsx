import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { motion, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const isMobile = useIsMobile();
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const [cursorText, setCursorText] = useState("");
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "project" | "button" | "link">("default");

  // Mouse coordinates
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // Interpolated coordinates for ring
  const ringX = useRef(0);
  const ringY = useRef(0);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // RAF loop for smooth interpolation of the outer ring
    let animationFrameId: number;
    const updateRing = () => {
      // Easing speed: 0.15 makes it smooth and follow physical drag lag
      ringX.current += (mouseX.current - ringX.current) * 0.15;
      ringY.current += (mouseY.current - ringY.current) * 0.15;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX.current}px, ${ringY.current}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateRing);
    };
    updateRing();

    // Hover state toggles
    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      
      // Project Cards
      const isProject = target.closest('[data-cursor="project"]') || target.getAttribute("data-cursor") === "project";
      if (isProject) {
        setCursorType("project");
        setCursorText(target.getAttribute("data-cursor-text") || "VIEW");
        return;
      }

      // Buttons
      const isButton = target.tagName.toLowerCase() === "button" || 
                       target.getAttribute("role") === "button" || 
                       target.closest('button') || 
                       target.getAttribute("data-cursor") === "button";
      if (isButton) {
        setCursorType("button");
        setCursorText(target.getAttribute("data-cursor-text") || "EXPLORE");
        return;
      }

      // Links (Anchor tags)
      const isLink = target.tagName.toLowerCase() === "a" || 
                     target.closest('a') || 
                     target.getAttribute("data-cursor") === "link";
      if (isLink) {
        setCursorType("link");
        return;
      }

      setCursorType("pointer");
    };

    const handleMouseLeave = () => {
      setCursorType("default");
      setCursorText("");
    };

    const registerListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, [data-cursor="pointer"], [data-cursor="project"], [data-cursor="button"], [data-cursor="link"]'
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    registerListeners();

    // Observe changes to document layout to bind dynamically loaded items
    const observer = new MutationObserver(() => {
      registerListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Hide normal cursor
    const style = document.createElement("style");
    style.innerHTML = `
      body, a, button, [role="button"], input, select, textarea {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Inner Dot cursor */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
      />

      {/* Outer Ring cursor */}
      <motion.div
        ref={cursorRingRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border text-white"
        animate={{
          width: cursorType === "project" ? 72 : cursorType === "button" ? 92 : cursorType === "link" ? 36 : 20,
          height: cursorType === "project" ? 72 : cursorType === "button" ? 34 : cursorType === "link" ? 36 : 20,
          borderRadius: cursorType === "button" ? "17px" : "50%",
          borderColor: cursorType === "default" ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.75)",
          backgroundColor: cursorType === "default" ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0.08)",
          backdropFilter: cursorType === "default" ? "blur(0px)" : "blur(3px)",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 20, mass: 0.1 }}
      >
        <AnimatePresence mode="wait">
          {cursorType === "project" && (
            <motion.span
              key="project-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[9px] font-bold uppercase tracking-[0.25em]"
            >
              {cursorText}
            </motion.span>
          )}

          {cursorType === "button" && (
            <motion.span
              key="button-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[9px] font-bold uppercase tracking-[0.2em]"
            >
              {cursorText}
            </motion.span>
          )}

          {cursorType === "link" && (
            <motion.div
              key="link-arrow"
              initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.5 }}
              className="text-white"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
