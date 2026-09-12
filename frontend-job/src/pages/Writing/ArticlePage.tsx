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
          
          // Fetch related posts
          const allPosts = await api.get(`/posts?category=${data.category}`);
          const filtered = (allPosts || [])
            .filter((p: any) => p._id !== data._id)
            .slice(0, 3);
          
          // Fallback if not enough category matches
          if (filtered.length < 2) {
            const recent = await api.get("/posts");
            const extra = (recent || [])
              .filter((p: any) => p._id !== data._id && !filtered.some((f: any) => f._id === p._id))
              .slice(0, 3 - filtered.length);
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
      <div className="flex min-h-screen items-center justify-center bg-background text-white">
        <CinematicBackground />
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Loading Article...</span>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const formattedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <Helmet>
        <title>{post.seoTitle || `${post.title} — Saurabh Rathore`}</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDescription || post.excerpt} />
        <meta property="og:image" content={getImageUrl(post.coverImage)} />
        <link rel="canonical" href={`https://saurabh-rathore.com/writing/${post.slug}`} />
      </Helmet>

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      {/* Header Info */}
      <section className="px-6 pb-8 pt-40 sm:px-8 lg:px-12 bg-transparent text-left relative z-10">
        <div className="mx-auto max-w-4xl">
          {/* Back button */}
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors mb-8 cursor-none"
          >
            <ArrowLeft size={10} /> Back to Writing
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#C9A96A] font-bold mb-4">
              {post.category}
            </span>
            <h1 className="font-display font-medium text-[clamp(2rem,6vw,4rem)] uppercase leading-[1.1] tracking-tight text-white mb-6 max-w-3xl">
              {post.title}
            </h1>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed font-sans max-w-2xl mb-6">
              {post.excerpt}
            </p>
            
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-white/40 font-bold border-t border-white/[0.06] pt-4.5 w-full">
              <span>{post.publishedAt ? formattedDate(post.publishedAt) : "Draft"}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
              <span>•</span>
              <span>Written by {post.author}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image banner */}
      {post.coverImage && (
        <section className="px-6 py-6 sm:px-8 lg:px-12 bg-transparent relative z-10">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="h-[35vh] md:h-[50vh] w-full rounded-[12px] overflow-hidden relative border border-white/[0.08]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${getImageUrl(post.coverImage, 1600)})` }}
              />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content canvas */}
      <section className="px-6 py-16 sm:px-8 lg:px-12 bg-transparent relative z-10">
        <div className="mx-auto max-w-[740px] text-left">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="prose prose-invert max-w-none text-white/80 font-sans leading-relaxed text-sm sm:text-base
              prose-headings:font-display prose-headings:font-medium prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-white
              prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/[0.06] prose-h2:pb-2
              prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3
              prose-p:mb-5 prose-p:leading-relaxed
              prose-strong:text-white prose-strong:font-bold
              prose-em:text-white/95
              prose-a:text-[#C9A96A] prose-a:underline hover:prose-a:text-white transition-colors
              prose-blockquote:border-l-2 prose-blockquote:border-[#C9A96A]/60 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-white/90
              prose-ul:list-disc prose-ul:pl-6 prose-ul:my-5 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-5 prose-ol:space-y-2
              prose-pre:bg-white/[0.02] prose-pre:border prose-pre:border-white/[0.06] prose-pre:p-4 prose-pre:rounded-[6px] prose-pre:my-6
              prose-code:text-accent prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
              prose-img:rounded-[8px] prose-img:border prose-img:border-white/5 prose-img:w-full"
            dangerouslySetInnerHTML={{ __html: resolveHtmlImages(post.content) }}
          />
        </div>
      </section>

      {/* Author Card Info */}
      <section className="px-6 py-12 sm:px-8 lg:px-12 bg-transparent relative z-10 border-t border-white/[0.04]">
        <div className="mx-auto max-w-[740px] text-left">
          <div className="flex items-center gap-4.5 p-6 rounded-[8px] border border-white/[0.06] bg-white/[0.01]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-[#C9A96A] text-sm font-bold border border-white/10 flex-shrink-0">
              SR
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white font-bold">About the Author</p>
              <p className="text-xs text-white/50 leading-relaxed mt-1">
                Saurabh Rathore is a premium Framer developer & visual interface designer engineering motion-first digital experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles list */}
      {relatedPosts.length > 0 && (
        <section className="px-6 py-20 sm:px-8 lg:px-12 bg-transparent relative z-10 border-t border-white/[0.04]">
          <div className="mx-auto max-w-4xl text-left">
            <h3 className="font-display font-medium text-xs uppercase tracking-[0.25em] text-white/40 mb-10">
              Related Articles
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {relatedPosts.map((rp) => (
                <div
                  key={rp._id}
                  className="group flex flex-col rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-4 hover:border-white/15 transition-all duration-300"
                >
                  <Link to={`/writing/${rp.slug}`} className="block overflow-hidden rounded-[4px] aspect-[16/10] w-full bg-black/20">
                    <img
                      src={getImageUrl(rp.coverImage, 400)}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 opacity-80"
                      loading="lazy"
                    />
                  </Link>
                  <span className="text-[8px] uppercase tracking-widest text-[#C9A96A] font-bold mt-4 mb-2 block">
                    {rp.category}
                  </span>
                  <Link to={`/writing/${rp.slug}`} className="block flex-grow mb-4">
                    <h4 className="font-display font-medium text-xs sm:text-sm uppercase tracking-wide text-white group-hover:text-accent transition-colors leading-snug">
                      {rp.title}
                    </h4>
                  </Link>
                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 text-[8px] uppercase tracking-widest text-white/40 font-bold">
                    <span>{rp.readingTime}</span>
                    <Link to={`/writing/${rp.slug}`} className="text-white hover:text-[#C9A96A] transition-colors flex items-center gap-0.5">
                      Read <ArrowRight size={8} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back CTA section */}
      <section className="px-6 py-16 sm:px-8 lg:px-12 bg-transparent relative z-10 border-t border-white/[0.04] text-center">
        <div className="mx-auto max-w-md">
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-[9px] uppercase tracking-[0.2em] font-bold text-white hover:border-white/30 hover:bg-white/5 transition-all cursor-none"
          >
            <ArrowLeft size={10} /> Back to Blog
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
