import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api, getImageUrl } from "../../services/api.js";
import { BlockBuilder } from "../../components/studio/BlockBuilder.js";
import { Save, ArrowLeft, Eye, ShieldAlert, Image, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "../../components/studio/ImageUpload.js";
import { RichTextEditor } from "../../components/studio/RichTextEditor.js";

interface BlockType {
  type: string;
  data: any;
}

export function CaseStudyEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  // Basic Info State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("E-Commerce");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailPublicId, setThumbnailPublicId] = useState("");
  const [year, setYear] = useState("");
  const [client, setClient] = useState("");
  const [industry, setIndustry] = useState("");
  const [duration, setDuration] = useState("");
  const [role, setRole] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [github, setGithub] = useState("");
  const [prototype, setPrototype] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  
  // Modular Blocks
  const [blocks, setBlocks] = useState<BlockType[]>([]);

  // Page level States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Media Library Modal helper
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [onSelectCallback, setOnSelectCallback] = useState<((url: string) => void) | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      // Fetch details
      const proj = await api.get(`/case-studies/all`);
      const target = proj.find((p: any) => p._id === id);
      
      if (!target) {
        setError("Project not found in database.");
        return;
      }

      setTitle(target.title || "");
      setSlug(target.slug || "");
      setCategory(target.category || "");
      setDescription(target.description || "");
      setImage(target.image || "");
      setImagePublicId(target.imagePublicId || "");
      setThumbnail(target.thumbnail || "");
      setThumbnailPublicId(target.thumbnailPublicId || "");
      setYear(target.year || "");
      setClient(target.client || "");
      setIndustry(target.industry || "");
      setDuration(target.duration || "");
      setRole(target.role || "");
      setTechnologies(target.technologies || []);
      setLiveLink(target.liveLink || "");
      setGithub(target.github || "");
      setPrototype(target.prototype || "");
      setStatus(target.status || "draft");
      setBlocks(target.blocks || []);
    } catch (err: any) {
      setError(err.message || "Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMedia = async (callback: (url: string) => void) => {
    setOnSelectCallback(() => callback);
    setMediaOpen(true);
    try {
      const items = await api.get("/media/list");
      setMediaList(items || []);
    } catch (err) {
      console.error("Failed to load media list:", err);
    }
  };

  const handleSelectMedia = (url: string) => {
    if (onSelectCallback) {
      onSelectCallback(url);
    }
    setMediaOpen(false);
    setOnSelectCallback(null);
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!technologies.includes(techInput.trim())) {
        setTechnologies([...technologies, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
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
    if (!title || !slug || !description) {
      setError("Please fill out all required basic information fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      title,
      slug,
      category,
      description,
      image,
      imagePublicId,
      thumbnail,
      thumbnailPublicId,
      year,
      client,
      industry,
      duration,
      role,
      technologies,
      liveLink,
      github,
      prototype,
      status,
      blocks
    };

    try {
      if (isNew) {
        await api.post("/case-studies", payload);
        setSuccess("Case study created successfully! Redirecting...");
        setTimeout(() => navigate("/studio/projects"), 1500);
      } else {
        await api.put(`/case-studies/${id}`, payload);
        setSuccess("Case study updated successfully.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
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
    <div className="space-y-8 relative">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-4">
          <Link
            to="/studio/projects"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">
              {isNew ? "New Case Study" : `Edit Case Study: ${title}`}
            </h2>
            <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">
              Draft and construct modular project layouts
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {!isNew && status === "published" && (
            <a
              href={`/work/${slug}`}
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
            <Save size={12} /> Save Case Study
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

      {/* Editor Body Split */}
      <form onSubmit={(e) => e.preventDefault()} className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        
        {/* Left Side: Modular Blocks & Core Data */}
        <div className="space-y-8">
          {/* Metadata Block Card */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 md:p-8 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-4">
              Project Basics
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Project Title *</span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={isNew ? generateSlug : undefined}
                  placeholder="Aeron Store"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">SEO Slug (URL identifier) *</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="aeron-store"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 font-mono"
                />
              </label>
            </div>

            <div className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Summary Description *</span>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Write a summary description..."
                rows={4}
              />
            </div>

            {/* Custom drag block builder */}
            <div className="border-t border-white/[0.06] pt-6">
              <BlockBuilder blocks={blocks} onChange={setBlocks} onOpenMediaLibrary={handleOpenMedia} />
            </div>
          </div>
        </div>

        {/* Right Side: Media Assets, Tags, Settings */}
        <div className="space-y-8">
          {/* Status & Settings */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              Publishing Config
            </h3>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              >
                <option value="draft">Draft (Admin Only)</option>
                <option value="published">Published (Live Portfolio)</option>
                <option value="archived">Archived (Hidden)</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Category</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="E-Commerce, Web App..."
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              />
            </label>
          </div>

          {/* Featured & Thumb Image Picker */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              Assets Settings
            </h3>

            <ImageUpload
              label="Featured Header Image"
              value={image}
              onChange={(url, publicId) => {
                setImage(url);
                setImagePublicId(publicId || "");
              }}
            />

            <div className="pt-2">
              <ImageUpload
                label="Thumbnail Gallery Image"
                value={thumbnail}
                onChange={(url, publicId) => {
                  setThumbnail(url);
                  setThumbnailPublicId(publicId || "");
                }}
              />
            </div>
          </div>

          {/* Project Details metadata */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              Project Details
            </h3>

            <div className="grid gap-4 grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Year</span>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-3.5 py-2 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Client</span>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Aeron Store"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-3.5 py-2 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Industry</span>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Retail"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-3.5 py-2 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Duration</span>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="4 Weeks"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-3.5 py-2 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">My Role</span>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Lead Visual Designer"
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              />
            </label>

            {/* Comma tag technologies */}
            <div className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Technologies Used (Enter to Add)</span>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder="Figma, Framer, React..."
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 mb-3"
              />
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded bg-white/5 border border-white/[0.06] pl-2.5 pr-1.5 py-0.5 text-[9px] font-bold text-white/60 tracking-wide"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(idx)}
                      className="text-white/30 hover:text-red-400 font-bold text-[8px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4 pt-4 border-t border-white/[0.04]">
              <label className="block">
                <span className="mb-1.5 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Live Website Link</span>
                <input
                  type="text"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[9px] uppercase tracking-wider text-white/40 font-bold">GitHub Repository</span>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Interactive Prototype (Figma)</span>
                <input
                  type="text"
                  value={prototype}
                  onChange={(e) => setPrototype(e.target.value)}
                  placeholder="https://figma.com/proto/..."
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Media Picker Modal Dialog Overlay */}
      {mediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-4xl h-[70vh] flex flex-col rounded-[6px] border border-white/[0.08] bg-[#0B0B0B] overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.01] px-6 py-4.5">
              <h3 className="font-['Bebas_Neue'] text-lg uppercase tracking-wider">Select Media Asset</h3>
              <button
                onClick={() => setMediaOpen(false)}
                className="text-white/40 hover:text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 scrollbar-none">
              {mediaList.length > 0 ? (
                mediaList.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMedia(m.url)}
                    className="group relative aspect-square rounded-[4px] border border-white/[0.06] bg-black overflow-hidden cursor-pointer hover:border-white/30 transition-all"
                  >
                    <img
                      src={getImageUrl(m.url)}
                      alt={m.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-white bg-black/75 px-2.5 py-1 rounded">Select</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-xs text-white/35">
                  No images uploaded. Go to Media Library to upload assets.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
