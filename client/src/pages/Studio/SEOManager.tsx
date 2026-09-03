import React, { useEffect, useState } from "react";
import { api, API_URL } from "../../services/api.js";
import { Save, Search, ShieldAlert, Globe, ExternalLink } from "lucide-react";

export function SEOManager() {
  const [seo, setSeo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("global");

  const fetchSEO = async () => {
    try {
      setLoading(true);
      const res = await api.get("/seo");
      setSeo(res || {});
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load SEO configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEO();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await api.put("/seo", seo);
      setSuccess("SEO configurations saved. Dynamic sitemap.xml and robots.txt updated automatically.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to save SEO settings.");
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalField = (key: string, value: any) => {
    setSeo((prev: any) => ({
      ...prev,
      global: {
        ...prev.global,
        [key]: value,
      },
    }));
  };

  const updatePageField = (page: string, key: string, value: any) => {
    setSeo((prev: any) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [page]: {
          ...prev.pages[page],
          [key]: value,
        },
      },
    }));
  };

  if (loading && !seo) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Scanning Metadata...</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "global", label: "Global Settings" },
    { id: "home", label: "Home Page" },
    { id: "work", label: "Work Catalog" },
    { id: "services", label: "Services Catalog" },
    { id: "about", label: "Biography Page" },
    { id: "contact", label: "Contact Page" }
  ];

  // Helper: Get preview details for active tab page
  const getPreviewData = () => {
    if (activeTab === "global") {
      return {
        title: seo.global?.siteTitle || "Page Title",
        url: "https://saurabh-rathore.com",
        desc: seo.global?.siteDescription || "Provide page description..."
      };
    }
    const pData = seo.pages?.[activeTab] || {};
    return {
      title: pData.metaTitle || seo.global?.siteTitle || "Page Title",
      url: pData.canonicalUrl || `https://saurabh-rathore.com/${activeTab}`,
      desc: pData.metaDescription || seo.global?.siteDescription || "Provide page description..."
    };
  };

  const preview = getPreviewData();

  return (
    <div className="space-y-6">
      {/* Header and save toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">SEO Dashboard Manager</h2>
          <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">Configure web crawler indexing settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          <Save size={12} /> Save SEO Settings
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

      {/* Grid structure: Left form edit, Right Google visual preview */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Tab navs */}
          <div className="flex border-b border-white/[0.06] overflow-x-auto scrollbar-none gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-3 text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? "border-b border-white text-white"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form edit cards */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-6">
            {activeTab === "global" ? (
              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">Global Metadata</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Fallback Site Title</span>
                    <input
                      type="text"
                      value={seo.global?.siteTitle || ""}
                      onChange={(e) => updateGlobalField("siteTitle", e.target.value)}
                      className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Fallback Keywords</span>
                    <input
                      type="text"
                      value={seo.global?.keywords || ""}
                      onChange={(e) => updateGlobalField("keywords", e.target.value)}
                      className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Fallback Description</span>
                  <textarea
                    value={seo.global?.siteDescription || ""}
                    onChange={(e) => updateGlobalField("siteDescription", e.target.value)}
                    className="w-full min-h-24 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 capitalize">
                  {activeTab} Page SEO Override
                </h3>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Meta Title</span>
                    <input
                      type="text"
                      value={seo.pages?.[activeTab]?.metaTitle || ""}
                      onChange={(e) => updatePageField(activeTab, "metaTitle", e.target.value)}
                      className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Canonical URL</span>
                    <input
                      type="text"
                      value={seo.pages?.[activeTab]?.canonicalUrl || ""}
                      onChange={(e) => updatePageField(activeTab, "canonicalUrl", e.target.value)}
                      className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 font-mono"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Meta Description</span>
                  <textarea
                    value={seo.pages?.[activeTab]?.metaDescription || ""}
                    onChange={(e) => updatePageField(activeTab, "metaDescription", e.target.value)}
                    className="w-full min-h-20 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
                  />
                </label>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Twitter Card Type</span>
                    <select
                      value={seo.pages?.[activeTab]?.twitterCard || "summary_large_image"}
                      onChange={(e) => updatePageField(activeTab, "twitterCard", e.target.value)}
                      className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                    >
                      <option value="summary_large_image">Summary Card (Large Image)</option>
                      <option value="summary">Summary Card (Small Image)</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Robots Settings</span>
                    <input
                      type="text"
                      value={seo.pages?.[activeTab]?.robotsSettings || "index, follow"}
                      onChange={(e) => updatePageField(activeTab, "robotsSettings", e.target.value)}
                      className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 font-mono"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Side */}
        <div className="space-y-6">
          {/* Google Preview Widget */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              Google Search Snippet Preview
            </h3>
            
            <div className="rounded-[4px] bg-[#050505] border border-white/[0.03] p-5 font-sans space-y-1">
              {/* URL */}
              <span className="text-[10px] text-white/40 font-light truncate block">
                {preview.url}
              </span>
              {/* Title */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-sm font-bold text-[#8ab4f8] hover:underline hover:text-blue-300 transition-colors block leading-tight"
              >
                {preview.title}
              </a>
              {/* Meta Description */}
              <p className="text-[11px] text-white/60 leading-relaxed truncate-3-lines pt-1">
                {preview.desc}
              </p>
            </div>
          </div>

          {/* Sitemap & Robots.txt Links */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 flex items-center gap-2">
              <Globe size={13} className="text-white/40" /> Live Search Indices
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">sitemap.xml</p>
                  <p className="text-[9px] text-white/30 tracking-wide mt-0.5">Google Sitemap indices</p>
                </div>
                <a
                  href={`${API_URL}/sitemap.xml`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.04] pt-3.5">
                <div>
                  <p className="font-bold text-white">robots.txt</p>
                  <p className="text-[9px] text-white/30 tracking-wide mt-0.5">Search crawler configuration</p>
                </div>
                <a
                  href={`${API_URL}/robots.txt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
