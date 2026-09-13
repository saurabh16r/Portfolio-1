import { useEffect, useRef, useState } from "react";
import { api, getImageUrl } from "../../services/api.js";
import { ImageUpload } from "../../components/studio/ImageUpload.js";
import {
  Save,
  Globe,
  ShieldAlert,
  Twitter,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Tag,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
import { updateSEOCache, applyFaviconTag } from "../../components/common/SEOHead.js";

// Helper — dynamically swap the favicon in the browser tab
function applyFavicon(url: string) {
  if (!url) return;
  applyFaviconTag(getImageUrl(url));
}

// ─────────────────────────────────────────────────────────────
// Twitter/X card preview
// ─────────────────────────────────────────────────────────────
function TwitterPreview({
  title,
  description,
  imageUrl,
  siteUrl,
  cardType,
}: {
  title: string;
  description: string;
  imageUrl: string;
  siteUrl: string;
  cardType: string;
}) {
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setImgErr(false);
  }, [imageUrl]);

  const domain = (() => {
    try {
      return new URL(siteUrl || "https://example.com").hostname;
    } catch {
      return siteUrl || "example.com";
    }
  })();

  const isLarge = cardType === "summary_large_image";
  const resolvedImg = getImageUrl(imageUrl);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#16181c] overflow-hidden text-white font-sans max-w-[500px]">
      {isLarge ? (
        <>
          {/* Large image on top */}
          <div className="w-full aspect-[1200/630] bg-[#0e0f12] overflow-hidden flex items-center justify-center">
            {resolvedImg && !imgErr ? (
              <img
                src={resolvedImg}
                alt="OG Preview"
                className="w-full h-full object-cover"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-white/20">
                <ImageIcon size={32} />
                <span className="text-[9px] uppercase tracking-wider">No Social Image</span>
              </div>
            )}
          </div>
          <div className="p-3 space-y-0.5">
            <p className="text-[11px] text-[#71767b]">{domain}</p>
            <p className="text-[13px] font-bold text-[#e7e9ea] leading-snug line-clamp-1">
              {title || "Site Title"}
            </p>
            <p className="text-[13px] text-[#71767b] leading-snug line-clamp-2">
              {description || "Site description will appear here."}
            </p>
          </div>
        </>
      ) : (
        /* Small summary card */
        <div className="flex gap-0 h-[120px]">
          <div className="w-[120px] shrink-0 bg-[#0e0f12] overflow-hidden flex items-center justify-center">
            {resolvedImg && !imgErr ? (
              <img
                src={resolvedImg}
                alt="OG Preview"
                className="w-full h-full object-cover"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-white/20">
                <ImageIcon size={20} />
              </div>
            )}
          </div>
          <div className="flex-1 p-3 space-y-0.5 overflow-hidden">
            <p className="text-[11px] text-[#71767b] truncate">{domain}</p>
            <p className="text-[13px] font-bold text-[#e7e9ea] leading-snug line-clamp-1">
              {title || "Site Title"}
            </p>
            <p className="text-[12px] text-[#71767b] leading-snug line-clamp-2">
              {description || "Site description will appear here."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Facebook / LinkedIn OG preview
// ─────────────────────────────────────────────────────────────
function OGPreview({
  title,
  description,
  imageUrl,
  siteUrl,
}: {
  title: string;
  description: string;
  imageUrl: string;
  siteUrl: string;
}) {
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setImgErr(false);
  }, [imageUrl]);

  const domain = (() => {
    try {
      return new URL(siteUrl || "https://example.com").hostname.toUpperCase();
    } catch {
      return (siteUrl || "EXAMPLE.COM").toUpperCase();
    }
  })();

  const resolvedImg = getImageUrl(imageUrl);

  return (
    <div className="border border-white/10 overflow-hidden max-w-[500px]">
      <div className="w-full aspect-[1200/630] bg-[#1c1e21] overflow-hidden flex items-center justify-center">
        {resolvedImg && !imgErr ? (
          <img
            src={resolvedImg}
            alt="OG Preview"
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-white/20">
            <ImageIcon size={32} />
            <span className="text-[9px] uppercase tracking-wider">No Social Image</span>
          </div>
        )}
      </div>
      <div className="bg-[#1c1e21] px-4 py-3 border-t border-white/5">
        <p className="text-[10px] text-[#b0b3b8] uppercase tracking-wider mb-0.5">{domain}</p>
        <p className="text-[13px] font-bold text-[#e4e6eb] line-clamp-1">
          {title || "Site Title"}
        </p>
        <p className="text-[12px] text-[#b0b3b8] line-clamp-1">
          {description || "Site description will appear here."}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Favicon preview circle
// ─────────────────────────────────────────────────────────────
function FaviconPreview({ url }: { url: string }) {
  const [err, setErr] = useState(false);
  const prevUrl = useRef(url);

  useEffect(() => {
    if (url !== prevUrl.current) {
      setErr(false);
      prevUrl.current = url;
    }
  }, [url]);

  const resolved = getImageUrl(url);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-[#050505] p-2">
        {resolved && !err ? (
          <img
            src={resolved}
            alt="Favicon preview"
            className="h-full w-full object-contain"
            onError={() => setErr(true)}
          />
        ) : (
          <Globe size={18} className="text-white/20" />
        )}
      </div>
      <div>
        <span className="block text-[10px] uppercase tracking-wider text-white/70 font-bold">
          Browser Tab Icon Preview
        </span>
        <span className="text-[9px] text-white/30 truncate max-w-[220px] block font-mono">
          {url || "Default /favicon.ico"}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export function SiteSettings() {
  const [global, setGlobal] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewTab, setPreviewTab] = useState<"twitter" | "og">("twitter");

  // ── Fetch current SEO data
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/seo");
      setGlobal(res?.global || {});
      if (res?.global?.favicon) {
        applyFavicon(res.global.favicon);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load site settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (global.favicon) {
      applyFavicon(global.favicon);
    }
  }, [global.favicon]);

  // ── Field updater
  const set = (key: string, value: any) =>
    setGlobal((prev: any) => ({ ...prev, [key]: value }));

  // ── Save handler — merges global into full SEO doc to avoid overwriting page-level settings
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const current = await api.get("/seo");
      const updated = { ...current, global };
      await api.put("/seo", updated);
      updateSEOCache(global);
      if (global.favicon) applyFavicon(global.favicon);
      setSuccess("Site settings saved successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to save site settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">
            Loading Site Identity...
          </span>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white placeholder-white/20 outline-none transition-all duration-200 focus:border-white/20";
  const labelCls =
    "mb-2 flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-white/40 font-bold";

  return (
    <div className="space-y-6">
      {/* ── Header toolbar ── */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">
            Site Identity & Settings
          </h2>
          <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">
            Global site title, favicon, and social share previews
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-black/20 border-t-black" />
          ) : (
            <Save size={12} />
          )}
          Save Settings
        </button>
      </div>

      {/* ── Alerts ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-[4px] border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="rounded-[4px] border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-400">
          {success}
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">

        {/* ════ LEFT — Form ════ */}
        <div className="space-y-5">

          {/* ── Core Identity ── */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-5">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 flex items-center gap-2">
              <Type size={13} className="text-white/40" /> Core Identity
            </h3>

            <label className="block">
              <span className={labelCls}>
                <Type size={10} /> Site Title
              </span>
              <input
                type="text"
                value={global.siteTitle || ""}
                onChange={(e) => set("siteTitle", e.target.value)}
                placeholder="e.g. Saurabh Rathore — UI Designer"
                className={inputCls}
              />
              <p className="mt-1.5 text-[9px] text-white/25">
                Global fallback title shown in browser tabs and search results.
              </p>
            </label>

            <label className="block">
              <span className={labelCls}>
                <AlignLeft size={10} /> Site Description
              </span>
              <textarea
                value={global.siteDescription || ""}
                onChange={(e) => set("siteDescription", e.target.value)}
                placeholder="Short description of your site shown in search results..."
                rows={3}
                className={inputCls}
              />
              <p className="mt-1.5 text-[9px] text-white/25">
                Recommended: 120–160 characters.{" "}
                Currently:{" "}
                <span
                  className={
                    (global.siteDescription?.length || 0) > 160
                      ? "text-red-400"
                      : "text-white/40"
                  }
                >
                  {global.siteDescription?.length || 0} chars
                </span>
              </p>
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelCls}>
                  <Globe size={10} /> Site URL
                </span>
                <input
                  type="url"
                  value={global.siteUrl || ""}
                  onChange={(e) => set("siteUrl", e.target.value)}
                  placeholder="https://saurabh-rathore.com"
                  className={`${inputCls} font-mono`}
                />
                <p className="mt-1.5 text-[9px] text-white/25">
                  Used for canonical URLs and sitemap generation.
                </p>
              </label>

              <label className="block">
                <span className={labelCls}>
                  <Tag size={10} /> SEO Keywords
                </span>
                <input
                  type="text"
                  value={global.keywords || ""}
                  onChange={(e) => set("keywords", e.target.value)}
                  placeholder="design, framer, UI/UX, portfolio"
                  className={inputCls}
                />
                <p className="mt-1.5 text-[9px] text-white/25">
                  Comma-separated. Minor search signal.
                </p>
              </label>
            </div>
          </div>

          {/* ── Favicon ── */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 flex items-center gap-2">
              <Globe size={13} className="text-white/40" /> Favicon — Browser Tab Icon
            </h3>

            <FaviconPreview url={global.favicon || ""} />

            <ImageUpload
              value={global.favicon || ""}
              onChange={(url) => set("favicon", url)}
              label="Upload Favicon Image (.ico, .png, .svg)"
            />

            <details className="mt-2 text-left">
              <summary className="text-[9px] uppercase tracking-wider text-white/40 font-semibold cursor-pointer hover:text-white/70 select-none">
                Or enter custom URL manually
              </summary>
              <div className="mt-2">
                <input
                  type="text"
                  value={global.favicon || ""}
                  onChange={(e) => set("favicon", e.target.value)}
                  placeholder="/favicon.ico or https://cdn.example.com/favicon.png"
                  className={`${inputCls} font-mono`}
                />
              </div>
            </details>
          </div>

          {/* ── OG Image ── */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 flex items-center gap-2">
              <ImageIcon size={13} className="text-white/40" /> Social Preview Image (OG Image)
            </h3>

            <p className="text-[10px] text-white/30 leading-relaxed">
              Shown when sharing your site link on Twitter/X, LinkedIn, WhatsApp, and Facebook.
              Recommended size:{" "}
              <span className="text-white/50 font-bold">1200 × 630 px</span>.
            </p>

            <ImageUpload
              value={global.openGraphImage || ""}
              onChange={(url) => set("openGraphImage", url)}
              label="Upload OG / Social Preview Image"
            />
          </div>

          {/* ── Twitter Card Type ── */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 flex items-center gap-2">
              <Twitter size={13} className="text-white/40" /> Twitter / X Card Type
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  value: "summary_large_image",
                  label: "Large Image Card",
                  desc: "Full-width image above text. Best for visual impact.",
                },
                {
                  value: "summary",
                  label: "Summary Card",
                  desc: "Small thumbnail beside text. More compact layout.",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("twitterCard", opt.value)}
                  className={`relative text-left p-4 rounded-[6px] border transition-all duration-200 ${
                    (global.twitterCard || "summary_large_image") === opt.value
                      ? "border-white/30 bg-white/5"
                      : "border-white/[0.06] bg-[#050505] hover:border-white/15"
                  }`}
                >
                  {(global.twitterCard || "summary_large_image") === opt.value && (
                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-white" />
                  )}
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">
                    {opt.label}
                  </p>
                  <p className="text-[9px] text-white/40">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════ RIGHT — Live Preview ════ */}
        <div className="space-y-5">
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
              Live Social Preview
            </h3>

            {/* Preview tab toggle */}
            <div className="flex rounded-[4px] border border-white/[0.08] overflow-hidden">
              {(["twitter", "og"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPreviewTab(tab)}
                  className={`flex-1 py-2 text-[9px] uppercase font-bold tracking-widest transition-all ${
                    previewTab === tab
                      ? "bg-white text-black"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab === "twitter" ? "Twitter / X" : "Facebook / OG"}
                </button>
              ))}
            </div>

            {previewTab === "twitter" ? (
              <TwitterPreview
                title={global.siteTitle || ""}
                description={global.siteDescription || ""}
                imageUrl={global.openGraphImage || ""}
                siteUrl={global.siteUrl || ""}
                cardType={global.twitterCard || "summary_large_image"}
              />
            ) : (
              <OGPreview
                title={global.siteTitle || ""}
                description={global.siteDescription || ""}
                imageUrl={global.openGraphImage || ""}
                siteUrl={global.siteUrl || ""}
              />
            )}

            <p className="text-[9px] text-white/25 leading-relaxed">
              Preview updates in real time as you type. Actual appearance may vary slightly across platforms.
            </p>
          </div>

          {/* ── Quick reference guide ── */}
          <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-5 space-y-3">
            <h4 className="text-[9px] uppercase tracking-widest font-bold text-white/40">
              Quick Reference
            </h4>
            <ul className="space-y-2.5 text-[9px] text-white/30 leading-relaxed">
              <li>
                <span className="text-white/50 font-bold">Title:</span> Keep under 60 chars for full display in Google.
              </li>
              <li>
                <span className="text-white/50 font-bold">Description:</span> 120–160 chars. Written for humans.
              </li>
              <li>
                <span className="text-white/50 font-bold">OG Image:</span> 1200×630 px PNG or JPG. Used across all social platforms.
              </li>
              <li>
                <span className="text-white/50 font-bold">Favicon:</span> Square .ico or .png. Shows in browser tabs and bookmarks.
              </li>
              <li>
                <span className="text-white/50 font-bold">Site URL:</span> Your canonical domain — used in sitemap.xml.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
