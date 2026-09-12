import React, { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { Save, FileText, ShieldAlert, Plus, Trash2, User } from "lucide-react";
import { ImageUpload } from "../../components/studio/ImageUpload.js";

export function ContentManager() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get("/content");
      setContent(res || {});
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load site content copy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await api.put("/content", content);
      setSuccess("Site content copy updated successfully! Public pages will reflect updates instantly.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to update content copy.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (section: string, key: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  if (loading && !content) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Assembling Copy...</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Freelance Hero" },
    { id: "jobHero", label: "Job Hero" },
    { id: "services", label: "Services Copy" },
    { id: "about", label: "Freelance About" },
    { id: "jobAbout", label: "Job About & Photo" },
    { id: "contact", label: "Contact Form" },
    { id: "footer", label: "Footer Details" }
  ];

  return (
    <div className="space-y-6">
      {/* Header and save toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">Content Copy Manager</h2>
          <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">Control live site-wide text copy</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <Save size={12} /> Save Copy Settings
        </button>
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

      {/* Tab Navigators */}
      <div className="flex border-b border-white/[0.06] overflow-x-auto scrollbar-none gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-3 text-[10px] uppercase font-bold tracking-widest transition-all ${
              activeTab === t.id
                ? "border-b border-white text-white"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panel */}
      <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 md:p-8 space-y-6">
        {activeTab === "hero" && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-2">Homepage Hero Intro</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Hero Large Heading</span>
                <input
                  type="text"
                  value={content.home?.heroTitle || ""}
                  onChange={(e) => updateField("home", "heroTitle", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Availability Status Sub-Eyebrow</span>
                <input
                  type="text"
                  value={content.home?.heroSubtitle || ""}
                  onChange={(e) => updateField("home", "heroSubtitle", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Intro Paragraph Description</span>
              <textarea
                value={content.home?.heroDescription || ""}
                onChange={(e) => updateField("home", "heroDescription", e.target.value)}
                className="w-full min-h-24 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
              />
            </label>

            {/* Editorial Quotes list */}
            <div className="border-t border-white/[0.04] pt-6 space-y-4">
              <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Editorial Quotes</span>
              {content.home?.quotes?.map((q: string, qIdx: number) => (
                <div key={qIdx} className="flex gap-3">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => {
                      const newQuotes = [...content.home.quotes];
                      newQuotes[qIdx] = e.target.value;
                      updateField("home", "quotes", newQuotes);
                    }}
                    className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs text-white outline-none focus:border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newQuotes = content.home.quotes.filter((_: any, i: number) => i !== qIdx);
                      updateField("home", "quotes", newQuotes);
                    }}
                    className="text-white/45 hover:text-red-400 self-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateField("home", "quotes", [...(content.home.quotes || []), ""])}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white"
              >
                <Plus size={10} /> Add Quote
              </button>
            </div>
          </div>
        )}

        {activeTab === "jobHero" && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-2">Job Portfolio Hero Intro</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Hero Title (Line 1 & 2)</span>
                <input
                  type="text"
                  value={content.jobHero?.heroTitle || ""}
                  onChange={(e) => updateField("jobHero", "heroTitle", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Availability Status Sub-Eyebrow</span>
                <input
                  type="text"
                  value={content.jobHero?.heroSubtitle || ""}
                  onChange={(e) => updateField("jobHero", "heroSubtitle", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Intro Description (Recruiter Focused)</span>
              <textarea
                value={content.jobHero?.heroDescription || ""}
                onChange={(e) => updateField("jobHero", "heroDescription", e.target.value)}
                className="w-full min-h-24 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
              />
            </label>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-2">Services Section Copy</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Services Header Title</span>
                <input
                  type="text"
                  value={content.services?.title || ""}
                  onChange={(e) => updateField("services", "title", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Services Header Eyebrow</span>
                <input
                  type="text"
                  value={content.services?.eyebrow || ""}
                  onChange={(e) => updateField("services", "eyebrow", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>

            {/* List Services cards */}
            <div className="border-t border-white/[0.04] pt-6 space-y-6">
              <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Offered Services & Pricing</span>
              {content.services?.list?.map((srv: any, sIdx: number) => (
                <div key={sIdx} className="rounded-[4px] border border-white/[0.04] bg-white/[0.01] p-5 space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newList = content.services.list.filter((_: any, i: number) => i !== sIdx);
                      updateField("services", "list", newList);
                    }}
                    className="absolute right-4 top-4 text-white/40 hover:text-red-400"
                    title="Delete Service"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Service Title</span>
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => {
                          const newList = [...content.services.list];
                          newList[sIdx].title = e.target.value;
                          updateField("services", "list", newList);
                        }}
                        className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs text-white outline-none focus:border-white/20"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Starting Price</span>
                      <input
                        type="text"
                        value={srv.price}
                        onChange={(e) => {
                          const newList = [...content.services.list];
                          newList[sIdx].price = e.target.value;
                          updateField("services", "list", newList);
                        }}
                        className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs text-white outline-none focus:border-white/20"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Service Description</span>
                    <textarea
                      value={srv.description}
                      onChange={(e) => {
                        const newList = [...content.services.list];
                        newList[sIdx].description = e.target.value;
                        updateField("services", "list", newList);
                      }}
                      className="w-full min-h-16 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateField("services", "list", [...(content.services.list || []), { title: "", price: "", description: "" }])}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white"
              >
                <Plus size={10} /> Add Service Card
              </button>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-2">Biography Details</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Biography Title Header</span>
                <input
                  type="text"
                  value={content.about?.title || ""}
                  onChange={(e) => updateField("about", "title", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Full Profile Name</span>
                <input
                  type="text"
                  value={content.about?.heading || ""}
                  onChange={(e) => updateField("about", "heading", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Main Biography text</span>
              <textarea
                value={content.about?.biography || ""}
                onChange={(e) => updateField("about", "biography", e.target.value)}
                className="w-full min-h-24 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Resume Link (PDF URL)</span>
              <input
                type="text"
                value={content.about?.resumeLink || ""}
                onChange={(e) => updateField("about", "resumeLink", e.target.value)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 font-mono"
              />
            </label>
          </div>
        )}

        {activeTab === "jobAbout" && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-2">Job Portfolio Dedicated About Me & Profile Photo</h3>
            
            {/* Image upload via Cloudinary */}
            <div className="border border-white/[0.06] rounded-[6px] bg-[#050505] p-5">
              <span className="mb-3 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Profile Photo (Cloudinary Upload)</span>
              <ImageUpload
                label="Upload Job Profile Image"
                value={content.jobAbout?.profileImage || ""}
                onChange={(url, publicId) => {
                  setContent((prev: any) => ({
                    ...prev,
                    jobAbout: {
                      ...prev.jobAbout,
                      profileImage: url,
                      profileImagePublicId: publicId || "",
                    },
                  }));
                }}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Section Eyebrow</span>
                <input
                  type="text"
                  value={content.jobAbout?.eyebrow || ""}
                  onChange={(e) => updateField("jobAbout", "eyebrow", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Full Profile Name / Heading</span>
                <input
                  type="text"
                  value={content.jobAbout?.heading || ""}
                  onChange={(e) => updateField("jobAbout", "heading", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Personal Story</span>
              <textarea
                value={content.jobAbout?.story || ""}
                onChange={(e) => updateField("jobAbout", "story", e.target.value)}
                className="w-full min-h-20 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Design Background</span>
                <textarea
                  value={content.jobAbout?.designBackground || ""}
                  onChange={(e) => updateField("jobAbout", "designBackground", e.target.value)}
                  className="w-full min-h-20 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Engineering Journey</span>
                <textarea
                  value={content.jobAbout?.devJourney || ""}
                  onChange={(e) => updateField("jobAbout", "devJourney", e.target.value)}
                  className="w-full min-h-20 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Current Focus</span>
              <textarea
                value={content.jobAbout?.currentFocus || ""}
                onChange={(e) => updateField("jobAbout", "currentFocus", e.target.value)}
                className="w-full min-h-20 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
              />
            </label>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-2">Contact Page Settings</h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Contact Header Title</span>
                <input
                  type="text"
                  value={content.contact?.title || ""}
                  onChange={(e) => updateField("contact", "title", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Contact Eyebrow</span>
                <input
                  type="text"
                  value={content.contact?.eyebrow || ""}
                  onChange={(e) => updateField("contact", "eyebrow", e.target.value)}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Form Success Message</span>
              <textarea
                value={content.contact?.formSuccess || ""}
                onChange={(e) => updateField("contact", "formSuccess", e.target.value)}
                className="w-full min-h-16 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              />
            </label>
          </div>
        )}

        {activeTab === "footer" && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 mb-2">Footer & Global details</h3>

            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Copyright Statement</span>
              <input
                type="text"
                value={content.footer?.copyright || ""}
                onChange={(e) => updateField("footer", "copyright", e.target.value)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
