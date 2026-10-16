import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * A lightweight route-change wipe. It uses transforms only, so the animation
 * stays on the compositor and does not add another animation loop.
 */
export function RouteTransition() {
  const { pathname } = useLocation();

  return (
    <motion.div
      key={pathname}
      aria-hidden="true"
      className="route-transition"
      initial={{ scaleY: 1, transformOrigin: "top" }}
      animate={{ scaleY: 0, transformOrigin: "top" }}
      transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="route-transition__line" />
      <span className="route-transition__wordmark">SR<span>®</span></span>
    </motion.div>
  );
}
