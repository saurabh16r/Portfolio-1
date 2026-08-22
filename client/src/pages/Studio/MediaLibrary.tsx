import React, { useEffect, useState } from "react";
import { api, getImageUrl } from "../../services/api.js";
import { Image, Upload, Copy, Trash2, RefreshCw, Check, ShieldAlert } from "lucide-react";

interface MediaItemType {
  id: string;
  url: string;
  name: string;
  createdAt: string;
  size: number;
}

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError("");
      const items = await api.get("/media/list");
      setMedia(items || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch media library assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size limit check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum allowed size is 5MB.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadedItem = await api.post("/media/upload", formData);
      if (uploadedItem) {
        setSuccess(`Successfully uploaded asset: ${file.name}`);
        setMedia((prev) => [uploadedItem, ...prev]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "File upload failed.");
    } finally {
      setUploading(false);
      // Clear file inputs
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset permanently?")) return;
    try {
      setError("");
      setSuccess("");
      await api.delete(`/media/${id}`);
      setMedia(media.filter((m) => m.id !== id));
      setSuccess("Media asset deleted successfully.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete media asset.");
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    // Resolve absolute URL if it is a relative path upload (for local server fallback)
    const absoluteUrl = url.startsWith("/") ? `${window.location.origin.replace("3000", "5000")}${url}` : url;
    
    navigator.clipboard.writeText(absoluteUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  // Size helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 1;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  if (loading && media.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Scanning Files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Header toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">Media Library</h2>
          <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">Upload and organize portfolio assets</p>
        </div>
        <button
          onClick={fetchMedia}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          title="Refresh Assets"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Drop zone / Upload Widget */}
      <div className="rounded-[6px] border border-dashed border-white/10 bg-[#0B0B0B] p-10 flex flex-col items-center justify-center text-center relative hover:border-white/25 transition-all">
        <Upload size={32} className="text-white/25 mb-4" />
        
        {uploading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-white" />
            <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Streaming File to CDN...</span>
          </div>
        ) : (
          <label className="cursor-pointer">
            <span className="inline-block rounded-[4px] bg-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-black hover:bg-white/90 transition-colors">
              Upload New File
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-3.5 font-bold">Supports PNG, JPG, WEBP (Max 5MB)</p>
          </label>
        )}
      </div>

      {/* Image Grid Display */}
      {media.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {media.map((m) => (
            <div
              key={m.id}
              className="group rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] overflow-hidden flex flex-col justify-between hover:border-white/15 transition-all"
            >
              {/* Image box */}
              <div className="relative aspect-square bg-black overflow-hidden border-b border-white/[0.04]">
                <img
                  src={getImageUrl(m.url)}
                  alt={m.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Floating details overlay on hover */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-[9px] uppercase tracking-wider font-bold">
                  <p className="text-white/45 truncate" title={m.name}>{m.name}</p>
                  <div className="flex justify-between items-center text-white/30 pt-4">
                    <span>{formatBytes(m.size)}</span>
                  </div>
                </div>
              </div>

              {/* Action tray */}
              <div className="flex divide-x divide-white/[0.04] bg-white/[0.01] text-[9px] uppercase font-bold tracking-widest">
                <button
                  onClick={() => handleCopyUrl(m.url, m.id)}
                  className="flex-1 py-3 text-white/50 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === m.id ? (
                    <>
                      <Check size={10} className="text-emerald-400" /> <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} /> Copy Link
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="px-3.5 text-white/45 hover:text-red-400 transition-colors flex items-center justify-center cursor-pointer"
                  title="Delete Image"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border border-white/[0.06] bg-[#0B0B0B] rounded-[6px] py-16 text-center">
          <p className="text-xs text-white/30 max-w-xs leading-relaxed">No files uploaded. Use the upload area above to populate your media assets library.</p>
        </div>
      )}
    </div>
  );
}
