import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { api, getImageUrl } from "@/services/api.js";
import { ArrowRight } from "lucide-react";

const CATEGORIES = ["ALL", "JOURNEY", "DESIGN", "BUILD", "EXPERIMENTS"];

interface PostType {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
}

export function WritingPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await api.get("/posts");
        setPosts(data || []);
      } catch (err) {
        console.error("Could not fetch published blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

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
  }, [posts]);

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

  // Find featured post
  const featuredPost = posts.find((p) => p.featured);
  
  // Filter non-featured posts by category
  const filteredPosts = posts.filter((p) => {
    if (featuredPost && p._id === featuredPost._id) return false;
    if (activeCategory === "ALL") return true;
    return p.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const formattedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F5F2EB] overflow-hidden font-sans">
      <Helmet>
        <title>Writing & Insights — Saurabh Rathore</title>
        <meta name="description" content="Thoughts, design experiments, build guides, and technical lessons from software engineering and visual design." />
        <link rel="canonical" href="https://saurabh-rathore.com/writing" />
      </Helmet>

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 pb-[110px] pt-40 sm:px-8 lg:px-12 bg-transparent">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-left"
          >
            <p className="mb-4 text-[0.62rem] uppercase tracking-[0.35em] text-[#F5F2EB]/40 font-bold">
              Journal & Archive
            </p>
            <h1 className="font-display font-medium text-[clamp(2.8rem,7vw,5.5rem)] uppercase leading-[0.9] tracking-tight text-[#F5F2EB] mb-8">
              Writ<span className="text-[#C9A96A]">ing</span>
            </h1>

            {/* Description & Explore interaction Row */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 max-w-4xl border-t border-white/[0.06] pt-8">
              <p className="text-[#F5F2EB]/65 text-xs sm:text-sm leading-relaxed font-sans max-w-xl">
                Thoughts, design experiments, build tutorials, and life lessons learned along the journey of crafting visual products.
              </p>
              
              <button
                onClick={() => {
                  const el = document.getElementById("featured-section");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="self-start sm:self-auto flex-shrink-0 border border-[#F5F2EB]/10 hover:border-[#C9A96A] hover:text-[#C9A96A] px-5 py-2.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-1.5 cursor-none"
              >
                Explore <ArrowRight size={10} className="rotate-90 text-[#C9A96A]" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredPost && (
        <section id="featured-section" className="px-6 py-4 sm:px-8 lg:px-12 bg-transparent">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="group relative flex flex-col md:flex-row md:items-stretch rounded-[12px] border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/12 transition-all duration-500 overflow-hidden min-h-[420px] md:h-[460px] cursor-none"
            >
              {/* Cover Image Block (40-45% width) */}
              <div className="relative w-full md:w-[42%] overflow-hidden bg-black/20 border-b md:border-b-0 md:border-r border-white/[0.06]">
                {featuredPost.coverImage ? (
                  <img
                    src={getImageUrl(featuredPost.coverImage, 800)}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-all duration-[600ms] ease-[0.16,1,0.3,1] group-hover:scale-[1.03] filter grayscale contrast-[1.05] group-hover:grayscale-0 opacity-70 group-hover:opacity-85"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#F5F2EB]/20 bg-gradient-to-br from-white/[0.02] to-transparent">
                    <span className="text-[9px] uppercase tracking-widest font-mono">No Cover Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Content Block (55-60% width) */}
              <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10 flex-1 text-left">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold mb-4 block">
                    Featured • {featuredPost.category}
                  </span>

                  <Link to={`/writing/${featuredPost.slug}`}>
                    <h2 className="font-display font-medium text-xl sm:text-2xl lg:text-3xl uppercase tracking-wide text-white group-hover:text-[#C9A96A] transition-colors leading-[1.2] mb-4">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-[#F5F2EB]/60 text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between text-[9px] uppercase tracking-widest text-[#F5F2EB]/40 font-bold">
                  <div className="flex items-center gap-3">
                    <span>{featuredPost.publishedAt ? formattedDate(featuredPost.publishedAt) : "Draft"}</span>
                    <span className="text-white/20">•</span>
                    <span>{featuredPost.readingTime}</span>
                  </div>
                  <Link
                    to={`/writing/${featuredPost.slug}`}
                    className="flex items-center gap-1.5 text-[#F5F2EB]/60 group-hover:text-[#C9A96A] transition-colors duration-300"
                  >
                    Read Article <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories Filter (Repositioned below the Featured article card with 100px margin) */}
      <section className="px-6 sm:px-8 lg:px-12 bg-transparent mt-[100px] mb-[60px]">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="mx-auto max-w-5xl relative border-y border-white/[0.04] py-6">
          <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none z-20 transition-opacity duration-300 ${showLeftFade ? "opacity-100" : "opacity-0"}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none z-20 transition-opacity duration-300 ${showRightFade ? "opacity-100" : "opacity-0"}`} />

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`no-scrollbar overflow-x-auto flex items-center gap-2.5 px-2 py-1 w-full select-none cursor-grab active:cursor-grabbing ${
              isOverflowing ? "justify-start" : "justify-start md:justify-center"
            }`}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 h-10 px-5 text-[0.62rem] font-bold uppercase tracking-[0.2em] transition-colors duration-300 rounded-full border relative ${
                    isActive
                      ? "border-transparent text-black"
                      : "border-white/10 text-[#F5F2EB]/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBlogFilter"
                      className="absolute inset-0 bg-[#C9A96A]"
                      style={{ borderRadius: "9999px" }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Archive (with 140px bottom spacing before footer) */}
      <section className="px-6 pb-[140px] sm:px-8 lg:px-12 bg-transparent min-h-[25vh]">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="flex flex-col w-full divide-y divide-white/[0.04] border-t border-white/[0.04]">
              {filteredPosts.map((post, idx) => {
                const count = String(idx + 1).padStart(2, "0");
                return (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="group py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.01] px-4 -mx-4 rounded-[6px] transition-colors duration-300"
                  >
                    <div className="flex items-start gap-5 md:gap-8 flex-1">
                      <span className="text-[10px] font-mono text-[#F5F2EB]/20 font-bold group-hover:text-[#C9A96A] transition-colors pt-1">
                        {count}
                      </span>
                      
                      <div className="flex flex-col text-left">
                        <Link to={`/writing/${post.slug}`}>
                          <h3 className="font-display font-medium text-base sm:text-lg uppercase tracking-wide text-[#F5F2EB]/95 group-hover:text-white transition-colors leading-tight mb-2 max-w-xl">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <p className="text-[9px] uppercase tracking-widest text-[#F5F2EB]/40 font-semibold font-sans mt-0.5">
                          <span className="text-[#C9A96A] font-bold">{post.category}</span>
                          <span className="mx-2">•</span>
                          <span>{post.readingTime}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-12">
                      <span className="text-[9px] font-sans text-[#F5F2EB]/30 uppercase tracking-widest font-bold">
                        {post.publishedAt ? formattedDate(post.publishedAt) : "Draft"}
                      </span>

                      <Link
                        to={`/writing/${post.slug}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all cursor-none"
                      >
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Refined compact empty state box (200px height)
            <div className="text-center h-[200px] flex flex-col items-center justify-center border border-white/[0.06] rounded-[6px] bg-white/[0.01]">
              <span className="text-[9px] uppercase tracking-widest text-[#F5F2EB]/30 font-bold">No entries</span>
              <h3 className="text-xs font-display font-medium tracking-wide mt-2 text-[#F5F2EB]/50">No additional articles in this category yet.</h3>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
