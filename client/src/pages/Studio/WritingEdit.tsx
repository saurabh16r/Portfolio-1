import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../services/api.js";
import { Save, ArrowLeft, Eye, ShieldAlert, Star } from "lucide-react";
import { ImageUpload } from "../../components/studio/ImageUpload.js";
import { RichTextEditor } from "../../components/studio/RichTextEditor.js";

const CATEGORY_OPTIONS = ["Journey", "Design", "Build", "Experiments"];

export function WritingEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  // Article Fields State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Design");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImagePublicId, setCoverImagePublicId] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Saurabh Rathore");
  const [readingTime, setReadingTime] = useState("5 min read");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [publishedAt, setPublishedAt] = useState<string>("");
  
  // SEO Metadata
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Page level States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      loadArticle();
    }
  }, [id]);

  // Calculate reading time automatically from content words
  useEffect(() => {
    if (!content) return;
    const textOnly = content.replace(/<[^>]*>/g, ""); // strip html
    const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
    const wpm = 200; // avg reading speed
    const calculatedMinutes = Math.max(1, Math.ceil(words / wpm));
    setReadingTime(`${calculatedMinutes} min read`);
  }, [content]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const postsList = await api.get(`/posts/all`);
      const target = postsList.find((p: any) => p._id === id);

      if (!target) {
        setError("Article not found in database.");
        return;
      }

      setTitle(target.title || "");
      setSlug(target.slug || "");
      setExcerpt(target.excerpt || "");
      setCategory(target.category || "Design");
      setTags(target.tags || []);
      setCoverImage(target.coverImage || "");
      setCoverImagePublicId(target.coverImagePublicId || "");
      setContent(target.content || "");
      setAuthor(target.author || "Saurabh Rathore");
      setReadingTime(target.readingTime || "5 min read");
      setFeatured(target.featured || false);
      setStatus(target.status || "draft");
      setSeoTitle(target.seoTitle || "");
      setSeoDescription(target.seoDescription || "");
      if (target.publishedAt) {
        setPublishedAt(new Date(target.publishedAt).toISOString().split("T")[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load article details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const generateSlug = () => {
    const autoSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !excerpt || !content || !coverImage) {
      setError("Please fill out all required fields: Title, Slug, Excerpt, Content, and Cover Image.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      title,
      slug,
      excerpt,
      category,
      tags,
      coverImage,
      coverImagePublicId,
      content,
      author,
      readingTime,
      featured,
      status,
      seoTitle,
      seoDescription,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined
    };

    try {
      if (isNew) {
        await api.post("/posts", payload);
        setSuccess("Article created successfully! Redirecting...");
        setTimeout(() => navigate("/studio/writing"), 1500);
      } else {
        await api.put(`/posts/${id}`, payload);
        setSuccess("Article updated successfully.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setError(err.message || "Failed to save article.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !title && !isNew) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Loading Editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative text-left">
      {/* Editor Toolbar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-4">
          <Link
            to="/studio/writing"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">
              {isNew ? "Create Article" : `Edit Article: ${title}`}
            </h2>
            <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">
              Draft and publish rich-text blog articles and case lessons
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {!isNew && status === "published" && (
            <a
              href={`/writing/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[4px] border border-white/10 px-4.5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white/60 hover:text-white transition-all"
            >
              <Eye size={12} /> View Public
            </a>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <Save size={12} /> Save Article
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-[4px] border border-red-500/20 bg-red-500/5 px-4.5 py-3 text-xs text-red-400">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-[4px] border border-emerald-500/20 bg-emerald-500/5 px-4.5 py-3 text-xs text-emerald-400">
          {success}
        </div>
      )}

      {/* Editor Body Grid Form */}
      <form onSubmit={(e) => e.preventDefault()} className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Left Column: Post Content Form */}
        <div className="space-y-8">
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 md:p-8 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-4">
              Article Basics
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Article Title *</span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={isNew ? generateSlug : undefined}
                  placeholder="Designing Better Motion for the Web"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">URL Slug *</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="designing-better-motion"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 font-mono"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Excerpt / Summary Description *</span>
              <textarea
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A brief editorial summary/intro shown on directory lists..."
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 resize-none"
              />
            </label>

            <div className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Body Content HTML *</span>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write article details using rich text..."
                rows={16}
              />
            </div>
          </div>

          {/* SEO Meta Box */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 md:p-8 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              SEO Optimization
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">SEO Title Tag</span>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Designing Motion on Web — Guide"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">SEO Meta Description</span>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Read our comprehensive breakdown of UI motion principles..."
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Publishing, Cover image, details */}
        <div className="space-y-8">
          {/* Publishing Settings */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              Publishing Settings
            </h3>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              >
                <option value="draft">Draft (Admin Only)</option>
                <option value="published">Published (Public blog)</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-[4px] border border-white/[0.06] bg-white/[0.01]">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                  <Star size={11} className={featured ? "text-accent fill-accent" : "text-white/30"} />
                  Featured Article
                </span>
                <span className="text-[8px] text-white/40 mt-1">Showcase prominently at top of Blog</span>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 bg-[#050505] border-white/10 rounded cursor-pointer accent-[#C9A96A]"
              />
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Publish Date Override</span>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 font-mono"
              />
            </label>
          </div>

          {/* Cover image upload */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              Cover Image *
            </h3>

            <ImageUpload
              label="Article Banner Image"
              value={coverImage}
              onChange={(url, publicId) => {
                setCoverImage(url);
                setCoverImagePublicId(publicId || "");
              }}
            />
          </div>

          {/* Article Info details */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              Metadata & Author
            </h3>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Author *</span>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Saurabh Rathore"
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Reading Time</span>
              <input
                type="text"
                required
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                placeholder="5 min read"
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              />
            </label>

            {/* Enter tag list */}
            <div className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Article Tags (Enter to Add)</span>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Webdesign, React, Motion..."
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 mb-3"
              />
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded bg-white/5 border border-white/[0.06] pl-2.5 pr-1.5 py-0.5 text-[9px] font-bold text-white/60 tracking-wide"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="text-white/30 hover:text-red-400 font-bold text-[8px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
