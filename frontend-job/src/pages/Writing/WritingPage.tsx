import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { api, getImageUrl } from "@/services/api.js";
import { ArrowRight, Sparkles } from "lucide-react";

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
  const featuredPost = posts.find((p) => p.featured) || (posts.length > 0 ? posts[0] : null);
  
  // Filter non-featured posts by category
  const filteredPosts = posts.filter((p) => {
    if (featuredPost && p._id === featuredPost._id) return false;
    if (activeCategory === "ALL") return true;
    return p.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const formattedDate = (dateStr: string) => {
    if (!dateStr) return "DRAFT";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).toUpperCase();
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F5F2EB] overflow-hidden font-sans">
      <Helmet>
        <title>Journal & Archive — Writing & Thoughts</title>
        <meta name="description" content="Thoughts, design experiments, build tutorials, and lessons learned while creating digital products." />
        <link rel="canonical" href="https://saurabh-rathore.com/writing" />
      </Helmet>

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      {/* 1. EDITORIAL BLOG HERO */}
      <section className="px-6 pt-36 pb-16 sm:px-8 sm:pt-44 sm:pb-20 lg:px-12 lg:pt-48 lg:pb-24 bg-transparent relative z-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-left"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A96A]" />
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#F5F2EB]/50 font-mono font-semibold">
                JOURNAL & ARCHIVE
              </p>
            </div>

            {/* Headline */}
            <h1 className="font-display font-medium text-[clamp(3.5rem,8.5vw,7.5rem)] uppercase leading-[0.88] tracking-tight text-[#F5F2EB] mb-8">
              WRIT<span className="text-[#C9A96A]">ING</span>
            </h1>

            {/* Horizontal Divider & Description Block */}
            <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <p className="text-[#F5F2EB]/70 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
                Thoughts, design experiments, build tutorials, and lessons learned while creating digital products.
              </p>

              <div className="flex items-center gap-6 text-[10px] font-mono text-[#F5F2EB]/40 uppercase tracking-widest shrink-0">
                <span>VOL. {new Date().getFullYear()}</span>
                <span>•</span>
                <span>{posts.length} {posts.length === 1 ? "ARTICLE" : "ARTICLES"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE CARD */}
      {featuredPost && (
        <section id="featured-section" className="px-6 py-6 sm:px-8 lg:px-12 bg-transparent relative z-10 mb-20 lg:mb-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="group relative flex flex-col lg:flex-row items-stretch rounded-[8px] border border-white/[0.08] bg-[#0D0D0D] hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              {/* Left Column: Article Information (55% width on desktop) */}
              <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12 lg:w-[55%] z-10 text-left">
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.2em] bg-[#C9A96A]/15 text-[#C9A96A] border border-[#C9A96A]/30">
                      FEATURED
                    </span>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[#F5F2EB]/40">
                      {featuredPost.category}
                    </span>
                  </div>

                  <Link to={`/writing/${featuredPost.slug}`} className="block group/title">
                    <h2 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-[#F5F2EB] group-hover/title:text-[#C9A96A] transition-colors leading-[1.1] mb-5">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-[#F5F2EB]/65 text-xs sm:text-sm font-sans leading-relaxed line-clamp-3 mb-8 max-w-xl">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-[10px] uppercase font-mono tracking-widest">
                  <div className="flex items-center gap-3 text-[#F5F2EB]/40 font-semibold">
                    <span>{formattedDate(featuredPost.publishedAt)}</span>
                    <span>•</span>
                    <span>{featuredPost.readingTime}</span>
                  </div>

                  <Link
                    to={`/writing/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 font-mono font-bold text-[#F5F2EB] group-hover:text-[#C9A96A] transition-colors cursor-pointer"
                  >
                    <span>READ ARTICLE</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Large Editorial Cover Image (45% width on desktop) */}
              <div className="relative lg:w-[45%] min-h-[260px] sm:min-h-[340px] lg:min-h-full overflow-hidden bg-black/40 border-t lg:border-t-0 lg:border-l border-white/[0.08]">
                {featuredPost.coverImage ? (
                  <img
                    src={getImageUrl(featuredPost.coverImage, 1000)}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] opacity-85 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#141414] to-[#0A0A0A]">
                    <Sparkles className="w-8 h-8 text-[#C9A96A]/40 mb-3" />
                    <span className="text-[10px] uppercase tracking-widest font-mono text-[#F5F2EB]/30">Editorial Feature</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/60 via-transparent to-transparent pointer-events-none lg:hidden" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 3. CATEGORY FILTER NAVIGATION */}
      <section className="px-6 sm:px-8 lg:px-12 bg-transparent relative z-10 mb-14 lg:mb-20">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="mx-auto max-w-6xl relative border-y border-white/[0.08] py-5">
          <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none z-20 transition-opacity duration-300 ${showLeftFade ? "opacity-100" : "opacity-0"}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none z-20 transition-opacity duration-300 ${showRightFade ? "opacity-100" : "opacity-0"}`} />

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`no-scrollbar overflow-x-auto flex items-center gap-3 px-1 py-0.5 w-full select-none cursor-grab active:cursor-grabbing ${
              isOverflowing ? "justify-start" : "justify-start md:justify-center"
            }`}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 h-9 px-5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors duration-300 rounded-full border relative ${
                    isActive
                      ? "border-transparent text-black"
                      : "border-white/10 text-[#F5F2EB]/50 hover:border-white/30 hover:text-[#F5F2EB]"
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

      {/* 4. ARTICLE GRID / LIST */}
      <section className="px-6 pb-28 sm:px-8 lg:px-12 lg:pb-36 bg-transparent relative z-10 min-h-[30vh]">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#C9A96A]" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {filteredPosts.map((post) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col rounded-[6px] border border-white/[0.06] bg-[#0C0C0C] p-6 hover:border-white/20 transition-all duration-300"
                >
                  {/* Cover Image */}
                  <Link to={`/writing/${post.slug}`} className="block overflow-hidden rounded-[4px] aspect-[16/10] w-full bg-[#121212] mb-5 border border-white/[0.04]">
                    {post.coverImage ? (
                      <img
                        src={getImageUrl(post.coverImage, 700)}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] opacity-80 group-hover:opacity-100"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
                        <span className="text-[9px] uppercase tracking-widest font-mono text-[#F5F2EB]/20">No Cover Image</span>
                      </div>
                    )}
                  </Link>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-widest text-[#F5F2EB]/40 mb-3">
                    <span className="text-[#C9A96A] font-bold">{post.category}</span>
                    <span>{formattedDate(post.publishedAt)}</span>
                  </div>

                  {/* Title */}
                  <Link to={`/writing/${post.slug}`} className="block mb-3">
                    <h3 className="font-display font-medium text-lg sm:text-xl uppercase tracking-wide text-[#F5F2EB] group-hover:text-[#C9A96A] transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-[#F5F2EB]/60 leading-relaxed font-sans line-clamp-2 mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#F5F2EB]/40">
                    <span>{post.readingTime}</span>
                    <Link
                      to={`/writing/${post.slug}`}
                      className="inline-flex items-center gap-1.5 font-bold text-[#F5F2EB]/70 group-hover:text-[#C9A96A] transition-colors cursor-pointer"
                    >
                      <span>READ ARTICLE</span>
                      <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            /* 6. COMPACT EDITORIAL EMPTY STATE */
            <div className="text-center py-16 px-6 border border-white/[0.06] rounded-[6px] bg-[#0C0C0C] max-w-md mx-auto my-12">
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C9A96A] font-bold block mb-2">
                NO ENTRIES
              </span>
              <p className="text-xs font-sans text-[#F5F2EB]/50">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
