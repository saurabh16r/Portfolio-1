import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { Upload, X, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { api, getImageUrl, API_URL } from "../../services/api.js";

interface ImageUploadProps {
  value: string;
  onChange: (url: string, publicId?: string) => void;
  label?: string;
  maxSizeMB?: number;
}

// Client-side image compression & WebP conversion helper
const compressAndPrepareImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    // Only compress images larger than 1.5MB
    if (!file.type.startsWith("image/") || file.size < 1.5 * 1024 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Downscale if image exceeds 1920px width/height
        const maxResolution = 1920;
        if (width > maxResolution || height > maxResolution) {
          if (width > height) {
            height = Math.round((height * maxResolution) / width);
            width = maxResolution;
          } else {
            width = Math.round((width * maxResolution) / height);
            height = maxResolution;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const baseName = file.name.substring(0, file.name.lastIndexOf("."));
              const compressedFile = new File([blob], `${baseName}.webp`, {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.82 // high-quality compression
        );
      };
    };
  });
};

// Helper to validate if value is a valid image URL (not "undefined", "null", etc.)
const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const s = String(url).trim();
  return s !== "" && s !== "undefined" && s !== "null" && s !== "[object Object]";
};

export function ImageUpload({ value, onChange, label, maxSizeMB = 10 }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep track of the current preview URL to revoke it
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Clean up preview url when permanent value is set from props
  useEffect(() => {
    if (value && previewUrl) {
      setPreviewUrl(null);
    }
  }, [value]);

  // Helper to extract Cloudinary public ID from URL
  const getPublicIdFromUrl = (url: string): string | null => {
    if (!url || !url.includes("cloudinary.com")) return null;
    try {
      const uploadIndex = url.indexOf("/upload/");
      if (uploadIndex === -1) return null;
      const afterUpload = url.substring(uploadIndex + 8);
      const slashIndex = afterUpload.indexOf("/");
      if (slashIndex === -1) return null;
      const versionPart = afterUpload.substring(0, slashIndex);
      let publicIdWithExt = afterUpload.substring(slashIndex + 1);
      if (!/^v\d+/.test(versionPart)) {
        publicIdWithExt = afterUpload;
      }
      const dotIndex = publicIdWithExt.lastIndexOf(".");
      if (dotIndex !== -1) {
        return publicIdWithExt.substring(0, dotIndex);
      }
      return publicIdWithExt;
    } catch {
      return null;
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processAndUploadFile(e.target.files[0]);
    }
  };

  const processAndUploadFile = async (file: File) => {
    setError(null);

    // Validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ["jpg", "jpeg", "png", "webp"];
    if (!allowedTypes.includes(file.type) && (!fileExt || !allowedExts.includes(fileExt))) {
      setError("Unsupported image format.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError("Image is too large.");
      return;
    }

    // Set immediate preview
    const tempPreview = URL.createObjectURL(file);
    setPreviewUrl(tempPreview);
    setUploading(true);
    setProgress(0);

    try {
      // Compress if needed
      const preparedFile = await compressAndPrepareImage(file);

      // Perform XHR upload to get progress updates
      const result: any = await uploadWithProgress(preparedFile);

      // Successfully uploaded
      onChange(result.url, result.id);
    } catch (err: any) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadWithProgress = (file: File) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = localStorage.getItem("token") || "";
      const uploadUrl = `${API_URL}/api/media/upload`;

      xhr.open("POST", uploadUrl);
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error("Upload succeeded but response formatting failed."));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error || `Upload failed (Status: ${xhr.status})`));
          } catch {
            reject(new Error(`Upload failed (Status: ${xhr.status})`));
          }
        }
      };

      xhr.onerror = () => reject(new Error("Network connection error."));

      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });
  };

  const handleRemove = async () => {
    if (!value) return;
    
    const publicId = getPublicIdFromUrl(value);
    
    // Reset inputs & values immediately for optimal user response speed
    setPreviewUrl(null);
    onChange("", "");
    setError(null);

    // Silently delete the old asset from Cloudinary in background (non-blocking)
    if (publicId) {
      try {
        await api.delete(`/media/${publicId}`);
      } catch (err) {
        console.warn("Failed to delete asset from Cloudinary database:", err);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = previewUrl || (isValidImageUrl(value) ? getImageUrl(value) : "");

  const isHeader = label?.toLowerCase().includes("featured") || label?.toLowerCase().includes("banner") || label?.toLowerCase().includes("hero") || label?.toLowerCase().includes("header");
  const isThumbnail = label?.toLowerCase().includes("thumbnail") || label?.toLowerCase().includes("gallery");
  const aspectClass = isHeader ? "aspect-video" : isThumbnail ? "aspect-[4/3]" : "aspect-[16/9]";

  return (
    <div className="space-y-2.5 w-full">
      {label && (
        <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">
          {label}
        </span>
      )}

      {displayImage ? (
        // Preview State Card
        <div className="relative rounded-[6px] border border-white/[0.08] bg-[#050505] overflow-hidden group">
          <img
            src={displayImage}
            alt={label ? `${label} preview` : "Image preview"}
            className={`w-full h-auto object-cover object-center opacity-85 group-hover:opacity-95 transition-opacity duration-300 ${aspectClass}`}
          />

          {uploading && (
            // Uploading progress glass overlay
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-10 p-4">
              <RefreshCw size={22} className="text-accent animate-spin mb-3" />
              <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden relative mb-1.5">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-accent font-bold">
                Uploading {progress}%
              </span>
            </div>
          )}

          {/* Actions Hover Strip overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-350 z-20">
            <span className="text-[9px] text-white/50 uppercase tracking-wider font-semibold truncate max-w-[50%]">
              {uploading ? "Compressing & Sending" : "Ready"}
            </span>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleButtonClick}
                disabled={uploading}
                className="rounded-[4px] border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white transition-all cursor-pointer disabled:opacity-40"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="rounded-[4px] border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-red-400 transition-all cursor-pointer disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Dropzone Area
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`flex flex-col items-center justify-center border border-dashed rounded-[6px] p-8 text-center cursor-pointer transition-all duration-300 min-h-44 ${
            dragActive
              ? "border-accent bg-accent/[0.02]"
              : "border-white/[0.08] bg-[#050505] hover:border-white/20 hover:bg-[#070707]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleChange}
          />

          <Upload size={22} className="text-white/30 mb-3.5 group-hover:text-white/50 transition-colors" />
          
          <p className="text-[10px] uppercase tracking-wider font-bold text-white/70">
            Drag & Drop Image
          </p>
          <span className="text-[9px] text-white/40 uppercase tracking-widest mt-1">
            or <span className="text-accent underline font-semibold">Select Image</span>
          </span>

          <div className="mt-4 flex items-center gap-1.5 text-[8px] uppercase tracking-wider text-white/35">
            <span>PNG • JPG • WEBP</span>
            <span>•</span>
            <span>Max {maxSizeMB}MB</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-red-400 font-semibold mt-1.5">
          <AlertCircle size={10} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
