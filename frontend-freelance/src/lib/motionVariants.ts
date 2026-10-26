import { type Variants } from "framer-motion";

export const EASING_EDITORIAL = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial Section Stagger Container
 */
export const sectionStaggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: EASING_EDITORIAL,
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

/**
 * Section Heading Reveal (Editorial hierarchy: Heading appears first)
 */
export const headingRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: EASING_EDITORIAL,
    },
  },
};

/**
 * Supporting Description Reveal
 */
export const descriptionRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(3px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: EASING_EDITORIAL,
    },
  },
};

/**
 * Project / Service Card Reveal
 */
export const cardRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: EASING_EDITORIAL,
    },
  },
};

/**
 * Image Reveal with subtle scale settling
 */
export const imageRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.04,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: EASING_EDITORIAL,
    },
  },
};

/**
 * Action / CTA Reveal (appears last in hierarchy)
 */
export const ctaRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASING_EDITORIAL,
    },
  },
};

/**
 * Reduced Motion Variants (Instant and accessible)
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
