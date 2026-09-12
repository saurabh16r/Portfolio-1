import { useState, useRef, ChangeEvent } from "react";
import { Bold, Italic, Link2, Image, Loader2, AlertCircle } from "lucide-react";
import { api } from "../../services/api.js";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function RichTextEditor({ value, onChange, placeholder = "", className = "", rows = 5 }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const replacement = before + selectedText + after;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    onChange(newValue);
    
    // Reset focus and cursor position after state updates
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleBold = () => {
    insertText("<strong>", "</strong>");
  };

  const handleItalic = () => {
    insertText("<em>", "</em>");
  };

  const handleLink = () => {
    const url = prompt("Enter link URL (e.g., https://example.com):");
    if (url === null) return;
    insertText(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-accent underline">`, "</a>");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Unsupported format. Select JPG, PNG, or WEBP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await api.post("/media/upload", formData);
      
      // Auto-insert image tag in content
      const imageHtml = `<img src="${result.url}" class="w-full my-6 rounded-[8px] border border-white/5 object-cover" alt="${file.name}" />\n`;
      insertText(imageHtml, "");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload inline image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`rounded-[4px] border border-white/[0.08] bg-[#050505] overflow-hidden ${className}`}>
      {/* Toolbar header */}
      <div className="flex items-center gap-1 bg-white/[0.02] px-3.5 py-1.5 border-b border-white/[0.06] flex-wrap justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleBold}
            title="Bold (HTML tags)"
            className="p-1.5 rounded-[4px] hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <Bold size={13} />
          </button>
          
          <button
            type="button"
            onClick={handleItalic}
            title="Italic (HTML tags)"
            className="p-1.5 rounded-[4px] hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <Italic size={13} />
          </button>

          <button
            type="button"
            onClick={handleLink}
            title="Insert Link"
            className="p-1.5 rounded-[4px] hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <Link2 size={13} />
          </button>

          <div className="w-[1px] h-4 bg-white/[0.08] mx-1.5" />

          <button
            type="button"
            onClick={handleImageClick}
            disabled={uploading}
            title="Insert Image Upload"
            className="p-1.5 rounded-[4px] hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
          >
            {uploading ? <Loader2 size={13} className="animate-spin text-accent" /> : <Image size={13} />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {uploading && (
          <span className="text-[7.5px] uppercase tracking-widest text-accent font-bold animate-pulse">
            Uploading Image...
          </span>
        )}
      </div>

      {/* Input Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent px-4 py-3 text-xs text-white outline-none placeholder:text-white/20 resize-y"
      />

      {error && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500/5 border-t border-red-500/10 text-[8px] uppercase tracking-wider text-red-400 font-semibold">
          <AlertCircle size={9} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
