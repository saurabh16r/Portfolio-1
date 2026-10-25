import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./RouteTransition.css";

const panels = [0, 1, 2, 3, 4];

/**
 * A route-change transition combining a full-screen curtain, staggered shutters,
 * a soft backdrop blur, and a restrained SR wordmark. It reuses the project's
 * existing Framer Motion dependency and respects reduced-motion preferences.
 */
export function RouteTransition() {
  const { pathname } = useLocation();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div key={pathname} className="route-transition" aria-hidden="true">
      <div className="route-transition__panels">
        {panels.map((panel) => (
          <motion.div
            key={panel}
            className="route-transition__panel"
            initial={{ scaleY: 1, transformOrigin: "top" }}
            animate={{ scaleY: 0, transformOrigin: "top" }}
            transition={{
              duration: 0.62,
              delay: panel * 0.055,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        ))}
      </div>

      <motion.div
        className="route-transition__identity"
        initial={{ opacity: 1, y: 0, scale: 0.96 }}
        animate={{ opacity: 0, y: -12, scale: 1.02 }}
        transition={{ duration: 0.32, delay: 0.22, ease: "easeOut" }}
      >
        <span className="route-transition__wordmark">SR<span>®</span></span>
        <motion.span
          className="route-transition__line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.42, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}
        />
        <span className="route-transition__label">DESIGNING WHAT'S NEXT</span>
      </motion.div>
    </div>
  );
}
