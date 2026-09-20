import React from "react";
import { getImageUrl, resolveHtmlImages } from "@/services/api.js";

interface ArticleContentRendererProps {
  content: string;
  className?: string;
}

/**
 * HTML Sanitizer using browser DOMParser to safely remove dangerous tags and scripts.
 */
function sanitizeHtml(htmlString: string): string {
  if (typeof window === "undefined" || !htmlString) return htmlString || "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Remove dangerous / non-editorial tags
    const unsafeTags = ["script", "iframe", "object", "embed", "form", "input", "button", "textarea", "style", "link", "meta"];
    unsafeTags.forEach((tag) => {
      doc.querySelectorAll(tag).forEach((el) => el.remove());
    });

    // Remove inline event handlers and javascript: URLs
    doc.querySelectorAll("*").forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.toLowerCase().startsWith("on") || attr.value.trim().toLowerCase().startsWith("javascript:")) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return doc.body.innerHTML;
  } catch (err) {
    console.error("Sanitization error:", err);
    return htmlString;
  }
}

/**
 * Formats plain text or unformatted raw text into structured HTML paragraphs, headings, blockquotes, and lists.
 */
function formatRawTextToHtml(rawText: string): string {
  if (!rawText) return "";

  // Normalize line endings
  const normalized = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // Split into blocks by double or multiple line breaks
  const blocks = normalized.split(/\n\s*\n+/);

  const formattedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";

    // 1. Explicit Markdown or H2/H3 Headings
    if (trimmed.startsWith("### ")) {
      const headingText = trimmed.replace(/^###\s+/, "");
      return `<h3>${headingText}</h3>`;
    }
    if (trimmed.startsWith("## ") || trimmed.startsWith("H2: ") || trimmed.startsWith("Heading: ")) {
      const headingText = trimmed.replace(/^(##|H2:|Heading:)\s+/, "");
      return `<h2>${headingText}</h2>`;
    }
    if (trimmed.startsWith("# ")) {
      const headingText = trimmed.replace(/^#\s+/, "");
      return `<h2>${headingText}</h2>`;
    }

    // Heuristic Heading detection: Short single line (< 65 chars), no ending punctuation (. ! ? :), not starting with lower case
    const lines = trimmed.split("\n");
    if (
      lines.length === 1 &&
      trimmed.length < 65 &&
      !/[.!?:]$/.test(trimmed) &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*") &&
      !trimmed.startsWith(">") &&
      !/^\d+\./.test(trimmed) &&
      /^[A-Z0-9]/.test(trimmed)
    ) {
      return `<h2>${trimmed}</h2>`;
    }

    // 2. Blockquote detection
    if (trimmed.startsWith(">") || (trimmed.startsWith('"') && trimmed.endsWith('"') && lines.length <= 4)) {
      const quoteText = trimmed.replace(/^>\s*/, "").replace(/^"/, "").replace(/"$/, "");
      return `<blockquote><p>${quoteText}</p></blockquote>`;
    }

    // 3. Unordered List detection
    if (lines.length > 1 && lines.every((l) => /^\s*[-*+]\s+/.test(l))) {
      const items = lines.map((l) => `<li>${l.replace(/^\s*[-*+]\s+/, "")}</li>`).join("");
      return `<ul>${items}</ul>`;
    }

    // 4. Ordered List detection
    if (lines.length > 1 && lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      const items = lines.map((l) => `<li>${l.replace(/^\s*\d+\.\s+/, "")}</li>`).join("");
      return `<ol>${items}</ol>`;
    }

    // 5. Code block detection
    if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
      const codeContent = trimmed.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
      return `<pre><code>${codeContent}</code></pre>`;
    }

    // 6. Regular Paragraph: preserve single newlines inside paragraph with <br />
    const parsedParagraph = trimmed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Simple inline markdown links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Simple inline bold **text**
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Simple inline italic *text*
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, "<br />");

    return `<p>${parsedParagraph}</p>`;
  });

  return formattedBlocks.filter(Boolean).join("");
}

export function ArticleContentRenderer({ content, className = "" }: ArticleContentRendererProps) {
  if (!content) return null;

  // Check if content already contains block HTML tags
  const hasBlockHtml = /<(p|h1|h2|h3|h4|ul|ol|blockquote|div|pre|section|article)[^>]*>/i.test(content);

  let finalHtml = "";

  if (hasBlockHtml) {
    // Content is HTML: resolve internal uploaded images first
    let processedHtml = resolveHtmlImages(content);
    
    // Replace double <br> tags with paragraph breaks if present
    processedHtml = processedHtml.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "</p><p>");

    finalHtml = sanitizeHtml(processedHtml);
  } else {
    // Content is raw plain text or markdown: parse into rich HTML blocks
    const formattedHtml = formatRawTextToHtml(content);
    const resolvedHtml = resolveHtmlImages(formattedHtml);
    finalHtml = sanitizeHtml(resolvedHtml);
  }

  return (
    <div
      className={`article-body-content max-w-[740px] w-full mx-auto text-left font-sans text-base sm:text-[17px] lg:text-[18px] text-[#F5F2EB]/85 leading-[1.8] ${className}`}
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  );
}
