import React from "react";
import { motion } from "framer-motion";

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * RouteTransition provides a smooth, restrained page content reveal
 * that coordinates with the cinematic transition overlays.
 */
export function RouteTransition({ children, className = "" }: RouteTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0.92, scale: 0.995 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0.92, scale: 0.995 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`min-h-screen w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
