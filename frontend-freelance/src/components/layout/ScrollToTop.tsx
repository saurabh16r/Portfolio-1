import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetScrollToTop } from "@/components/layout/SmoothScroll";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        if (window.__lenis) {
          window.__lenis.scrollTo(el as HTMLElement, { offset: -70, immediate: false });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
    }
    resetScrollToTop();
  }, [pathname, hash]);

  return null;
}
