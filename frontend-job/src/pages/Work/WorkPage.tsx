import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ProjectCard } from "@/components/common/ProjectCard";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { api } from "@/services/api.js";

const categories = [
  "All",
  "Websites",
  "Landing Pages",
  "Dashboards",
  "Mobile Apps",
  "Branding",
  "E-Commerce",
  "FinTech",
];

export function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liveProjects, setLiveProjects] = useState<any[]>(projects);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const live = await api.get("/case-studies?status=published&audience=job");
        if (live && live.length > 0) {
          setLiveProjects(live);
        }
      } catch (err) {
        console.log("Could not load live projects, using static copy.");
      }
    };
    fetchLiveProjects();
  }, []);

  const jobOrder = [
    "mamta-superspeciality-hospital",
    "royal-flosss",
    "dadi-sati-hospital",
    "finovo",
    "gattani-tiles",
    "bharosa-bhai",
    "deven"
  ];

  const audienceFiltered = liveProjects.filter((p) => !p.audience || p.audience === "job" || p.audience === "both");

  // Dynamically sort projects
  const sortedProjects = [...audienceFiltered].sort((a, b) => {
    const idxA = jobOrder.indexOf(a.slug);
    const idxB = jobOrder.indexOf(b.slug);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  const filteredProjects = sortedProjects.filter((project) => {
    const matchesCategory =
      activeCategory === "All" ||
      project.category.toLowerCase() === activeCategory.toLowerCase() ||
      (activeCategory === "Websites" &&
        (project.category.toLowerCase() === "e-commerce" || project.category.toLowerCase() === "landing page" || project.category.toLowerCase() === "d2c gifting" || project.category.toLowerCase() === "retail / interiors")) ||
      (activeCategory === "Mobile Apps" && project.category.toLowerCase() === "mobile app") ||
      (activeCategory === "FinTech" && project.category.toLowerCase() === "fintech") ||
      (activeCategory === "Landing Pages" && (project.category.toLowerCase() === "landing page" || project.category.toLowerCase() === "d2c gifting" || project.category.toLowerCase() === "retail / interiors"));

    return matchesCategory;
  });

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 5);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
      updateFades();
    };

    checkOverflow();

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("scroll", updateFades);
    window.addEventListener("resize", checkOverflow);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [liveProjects]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    el.style.scrollBehavior = "auto";
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    const el = scrollRef.current;
    if (el) el.style.scrollBehavior = "smooth";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <Helmet>
        <title>Selected Case Studies — Saurabh Rathore</title>
        <meta name="description" content="Explore my case studies, digital product designs, web layouts, and interactive experiences." />
        <link rel="canonical" href="https://saurabh-rathore.com/work" />
      </Helmet>

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 pb-16 pt-48 sm:px-8 lg:px-12 bg-transparent">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="mb-4 text-[0.62rem] uppercase tracking-[0.35em] text-white/40 font-bold">
              Project Archive
            </p>
            <h1 className="font-display font-medium text-[clamp(3.5rem,10vw,7.5rem)] uppercase leading-[0.88] tracking-tight text-white mb-8">
              Selected <span className="text-accent">Work</span>
            </h1>
            <p className="max-w-xl text-white/60 text-base sm:text-lg leading-relaxed font-sans">
              Explore my collection of high-end digital interfaces, web products, and software engineering projects shipped for products and engineering teams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Filters Strip */}
      <section className="px-6 py-8 sm:px-8 lg:px-12 border-y border-white/[0.04] bg-transparent">
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className="mx-auto max-w-7xl relative">
          
          {/* Left Gradient Fade */}
          <div 
            className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-20 transition-opacity duration-300 ${
              showLeftFade ? "opacity-100" : "opacity-0"
            }`} 
          />
          
          {/* Right Gradient Fade */}
          <div 
            className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-20 transition-opacity duration-300 ${
              showRightFade ? "opacity-100" : "opacity-0"
            }`} 
          />

          {/* Horizontally scrollable container */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`no-scrollbar overflow-x-auto flex items-center gap-3.5 px-6 py-2 w-full select-none cursor-grab active:cursor-grabbing ${
              isOverflowing ? "justify-start" : "justify-start md:justify-center"
            }`}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ y: -2 }}
                  animate={{ scale: isActive ? 1.03 : 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className={`relative flex-shrink-0 h-11 px-6 text-[0.65rem] font-medium uppercase tracking-[0.15em] transition-colors duration-300 rounded-full border select-none cursor-none ${
                    isActive
                      ? "border-transparent text-[#0A0A0A]"
                      : "border-[#F5F2EB]/15 text-[#F5F2EB]/80 hover:border-[#F5F2EB]/40 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterBackground"
                      className="absolute inset-0 bg-[#C9A96A] rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">
                    {cat}
                  </span>
                </motion.button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Projects Grid Section: 2 Columns */}
      <section className="px-6 py-28 sm:px-8 lg:px-12 bg-transparent min-h-[40vh]">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              <motion.div
                layout
                className="grid gap-5 md:grid-cols-2 lg:gap-6"
              >
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 border border-white/[0.08] rounded-[6px] bg-card"
              >
                <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/30 mb-2 font-bold">No Results</p>
                <h3 className="text-xl font-display font-medium tracking-wide text-white">No projects found matching that filter.</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
