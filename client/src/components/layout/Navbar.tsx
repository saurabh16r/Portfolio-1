import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ArrowRight } from "lucide-react";
import { navItems } from "@/data/navigation";
import { LuxuryButton } from "@/components/common/LuxuryButton";
import { Magnetic } from "@/components/common/Magnetic";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.1 }}
      className={`fixed inset-x-0 top-0 z-[1000] flex items-center transition-all duration-500 border-b ${
        scrolled
          ? "h-[68px] border-white/[0.06] bg-[#0A0A0A]/85 backdrop-blur-md"
          : "h-[80px] border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 sm:px-8 md:px-12 h-full">
        {/* Logo (Left Column) */}
        <div className="flex-1 flex justify-start">
          <Magnetic range={50} strength={0.25}>
            <Link
              to="/"
              className="font-display font-semibold text-[1.4rem] uppercase tracking-[0.35em] text-white hover:opacity-80 transition-opacity block"
            >
              S<span className="text-[#c0c0c0]">R</span>
            </Link>
          </Magnetic>
        </div>

        {/* Desktop Navigation (Center Column) */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href} className="relative">
                <Magnetic range={40} strength={0.3}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `relative transition-colors duration-300 block py-2 group text-[0.62rem] font-medium uppercase tracking-[0.3em] ${
                        isActive ? "text-accent" : "text-white/45 hover:text-white"
                      }`
                    }
                  >
                    {item.label}
                    {/* Elegant hover/active underline */}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[1.5px] origin-left transition-transform duration-300 ease-[0.16,1,0.3,1] ${
                        location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(`${item.href}/`))
                          ? "bg-accent scale-x-100"
                          : "bg-white/40 scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </NavLink>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop CTA (Right Column) */}
        <div className="hidden md:flex flex-1 justify-end">
          <Magnetic range={40} strength={0.3}>
            <Link
              to="/contact"
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-5 h-10 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white overflow-hidden transition-all duration-300 hover:border-white/40 hover:text-white"
            >
              {/* Background fills subtly */}
              <motion.span
                className="absolute inset-0 bg-white/[0.05] pointer-events-none"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{
                  scale: ctaHovered ? 1 : 0.95,
                  opacity: ctaHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <span className="relative z-10">Let's Talk</span>
              <motion.span
                className="relative z-10"
                animate={{ x: ctaHovered ? 4 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ArrowRight size={12} />
              </motion.span>
            </Link>
          </Magnetic>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Magnetic range={50} strength={0.3}>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-white/30 bg-transparent cursor-none"
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </Magnetic>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-white/5 bg-background/95 px-6 py-8 md:hidden absolute top-[100%] left-0 w-full overflow-y-auto max-h-[calc(100vh-80px)]"
          >
            <div className="flex flex-col gap-6">
              <NavLink
                to="/"
                className={
                  location.pathname === "/"
                    ? "text-[0.8rem] uppercase tracking-[0.35em] text-accent font-semibold transition-colors"
                    : "text-[0.8rem] uppercase tracking-[0.35em] text-[#999] hover:text-white transition-colors"
                }
              >
                Home
              </NavLink>

              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `text-[0.8rem] uppercase tracking-[0.35em] transition-colors ${
                      isActive ? "text-accent font-semibold" : "text-[#999] hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="h-px bg-white/5 my-2" />

              <div className="flex flex-col gap-4">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-1 text-[0.75rem] uppercase tracking-[0.25em] text-[#8b8b8b] hover:text-white transition-colors"
                >
                  Resume <ArrowUpRight size={12} />
                </a>
                <LuxuryButton to="/contact" className="py-3 w-full" showArrow={false}>
                  Let's Talk
                </LuxuryButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
