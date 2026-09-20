import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { api, getImageUrl, resolveHtmlImages } from "@/services/api.js";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PostType {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  seoTitle?: string;
  seoDescription?: string;
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.get(`/posts/${slug}`);
        if (data) {
          setPost(data);
          
          // Fetch related posts in same category
          const allPosts = await api.get(`/posts?category=${data.category}`);
          const filtered = (allPosts || [])
            .filter((p: any) => p._id !== data._id)
            .slice(0, 2);
          
          if (filtered.length < 2) {
            const recent = await api.get("/posts");
            const extra = (recent || [])
              .filter((p: any) => p._id !== data._id && !filtered.some((f: any) => f._id === p._id))
              .slice(0, 2 - filtered.length);
            setRelatedPosts([...filtered, ...extra]);
          } else {
            setRelatedPosts(filtered);
          }
        }
      } catch (err) {
        console.error("Could not fetch article details:", err);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-[#F5F2EB]">
        <CinematicBackground />
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#C9A96A]" />
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#F5F2EB]/40 font-semibold">Loading Entry...</span>
        </div>
      </div>
    );
  }

  if (!post) return null;

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
        <title>{post.seoTitle || `${post.title} — Journal`}</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDescription || post.excerpt} />
        {post.coverImage && <meta property="og:image" content={getImageUrl(post.coverImage)} />}
        <link rel="canonical" href={`https://saurabh-rathore.com/writing/${post.slug}`} />
      </Helmet>

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      {/* Article Header & Title Block */}
      <section className="px-6 pt-36 pb-12 sm:px-8 sm:pt-44 lg:px-12 lg:pt-48 bg-transparent text-left relative z-10">
        <div className="mx-auto max-w-[760px]">
          {/* Back link */}
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.2em] font-semibold text-[#F5F2EB]/40 hover:text-[#C9A96A] transition-colors mb-10"
          >
            <ArrowLeft size={10} /> BACK TO JOURNAL
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            {/* Category & Tags */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#C9A96A]">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-medium text-[clamp(2.2rem,5vw,3.8rem)] uppercase leading-[1.05] tracking-tight text-[#F5F2EB] mb-6">
              {post.title}
            </h1>

            {/* Excerpt / Intro */}
            {post.excerpt && (
              <p className="text-[#F5F2EB]/70 text-base sm:text-lg leading-relaxed font-sans max-w-2xl mb-8 border-l border-[#C9A96A]/60 pl-5 italic">
                {post.excerpt}
              </p>
            )}
            
            {/* Metadata Bar */}
            <div className="flex items-center gap-3 text-[10px] uppercase font-mono tracking-widest text-[#F5F2EB]/40 font-semibold border-t border-b border-white/[0.08] py-4 w-full">
              <span>{formattedDate(post.publishedAt)}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
              {post.author && (
                <>
                  <span>•</span>
                  <span>BY {post.author.toUpperCase()}</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Large Cover Image Banner */}
      {post.coverImage && (
        <section className="px-6 py-6 sm:px-8 lg:px-12 bg-transparent relative z-10">
          <div className="mx-auto max-w-[840px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="h-[35vh] sm:h-[45vh] lg:h-[50vh] w-full rounded-[8px] overflow-hidden relative border border-white/[0.08] bg-black/40"
            >
              <img
                src={getImageUrl(post.coverImage, 1600)}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Reading Canvas (Comfortable Width ~720px) */}
      <section className="px-6 py-12 sm:px-8 lg:px-12 bg-transparent relative z-10">
        <div className="mx-auto max-w-[720px] text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="prose prose-invert max-w-none text-[#F5F2EB]/80 font-sans leading-relaxed text-sm sm:text-base
              prose-headings:font-display prose-headings:font-medium prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-[#F5F2EB]
              prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:border-b prose-h2:border-white/[0.08] prose-h2:pb-3
              prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4
              prose-p:mb-6 prose-p:leading-relaxed
              prose-strong:text-[#F5F2EB] prose-strong:font-bold
              prose-em:text-[#F5F2EB]/95
              prose-a:text-[#C9A96A] prose-a:underline hover:prose-a:text-[#F5F2EB] transition-colors
              prose-blockquote:border-l-2 prose-blockquote:border-[#C9A96A] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-[#F5F2EB]/90
              prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-2
              prose-pre:bg-[#0E0E0E] prose-pre:border prose-pre:border-white/[0.08] prose-pre:p-5 prose-pre:rounded-[6px] prose-pre:my-8
              prose-code:text-[#C9A96A] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
              prose-img:rounded-[6px] prose-img:border prose-img:border-white/[0.08] prose-img:w-full"
            dangerouslySetInnerHTML={{ __html: resolveHtmlImages(post.content) }}
          />
        </div>
      </section>

      {/* Author & Footer Note */}
      <section className="px-6 py-10 sm:px-8 lg:px-12 bg-transparent relative z-10">
        <div className="mx-auto max-w-[720px] text-left">
          <div className="flex items-center gap-5 p-6 rounded-[6px] border border-white/[0.08] bg-[#0C0C0C]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96A]/10 text-[#C9A96A] text-sm font-mono font-bold border border-[#C9A96A]/30 flex-shrink-0">
              SR
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-[#F5F2EB] font-bold">WRITTEN BY SAURABH RATHORE</p>
              <p className="text-xs text-[#F5F2EB]/50 leading-relaxed mt-1">
                Visual interface designer & engineer crafting motion-driven digital products and editorial web experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Entries */}
      {relatedPosts.length > 0 && (
        <section className="px-6 py-16 sm:px-8 lg:px-12 bg-transparent relative z-10 border-t border-white/[0.08] mt-12">
          <div className="mx-auto max-w-[760px] text-left">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#F5F2EB]/40 mb-8 font-bold">
              FURTHER READING
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((rp) => (
                <div
                  key={rp._id}
                  className="group flex flex-col rounded-[6px] border border-white/[0.06] bg-[#0C0C0C] p-5 hover:border-white/20 transition-all duration-300"
                >
                  <Link to={`/writing/${rp.slug}`} className="block overflow-hidden rounded-[4px] aspect-[16/10] w-full bg-[#121212] mb-4 border border-white/[0.04]">
                    {rp.coverImage ? (
                      <img
                        src={getImageUrl(rp.coverImage, 500)}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-80"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
                        <span className="text-[8px] uppercase tracking-widest font-mono text-[#F5F2EB]/20">No Cover</span>
                      </div>
                    )}
                  </Link>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#C9A96A] font-bold mb-2">
                    {rp.category}
                  </span>
                  <Link to={`/writing/${rp.slug}`} className="block mb-4 flex-grow">
                    <h4 className="font-display font-medium text-sm sm:text-base uppercase tracking-wide text-[#F5F2EB] group-hover:text-[#C9A96A] transition-colors leading-snug">
                      {rp.title}
                    </h4>
                  </Link>
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-[9px] uppercase font-mono tracking-widest text-[#F5F2EB]/40">
                    <span>{rp.readingTime}</span>
                    <Link to={`/writing/${rp.slug}`} className="text-[#F5F2EB] hover:text-[#C9A96A] transition-colors flex items-center gap-1 font-bold">
                      <span>READ</span> <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Journal Link */}
      <section className="px-6 py-16 sm:px-8 lg:px-12 bg-transparent relative z-10 text-center border-t border-white/[0.06]">
        <div className="mx-auto max-w-md">
          <Link
            to="/writing"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 px-7 py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#F5F2EB] hover:border-[#C9A96A] hover:text-[#C9A96A] hover:bg-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft size={10} /> BACK TO ALL ARTICLES
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
