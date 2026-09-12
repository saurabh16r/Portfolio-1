import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Copy, Layers } from "lucide-react";
import { ImageUpload } from "./ImageUpload.js";
import { RichTextEditor } from "./RichTextEditor.js";

interface BlockType {
  type: string;
  data: any;
}

interface BlockBuilderProps {
  blocks: BlockType[];
  onChange: (newBlocks: BlockType[]) => void;
  onOpenMediaLibrary?: (onSelect: (url: string) => void) => void;
}

const AVAILABLE_BLOCKS = [
  "Hero",
  "Overview",
  "Problem",
  "Goals",
  "Research",
  "User Persona",
  "Design System",
  "High Fidelity UI",
  "Challenges",
  "Results",
  "Gallery",
  "Testimonial",
  "Key Learnings",
  "Conclusion"
];

export function BlockBuilder({ blocks, onChange }: BlockBuilderProps) {
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAddBlock = (type: string) => {
    const defaultData = getBlockDefaultData(type);
    const newBlocks = [...blocks, { type, data: defaultData }];
    onChange(newBlocks);
    
    // Automatically expand the new block
    setExpandedIndices((prev) => ({
      ...prev,
      [newBlocks.length - 1]: true
    }));
  };

  const handleDeleteBlock = (index: number) => {
    if (!confirm(`Are you sure you want to delete this ${blocks[index].type} block?`)) return;
    const newBlocks = blocks.filter((_, idx) => idx !== index);
    onChange(newBlocks);
  };

  const handleDuplicateBlock = (index: number) => {
    const source = blocks[index];
    const newBlocks = [...blocks];
    const duplicatedBlock = {
      type: source.type,
      data: JSON.parse(JSON.stringify(source.data))
    };
    newBlocks.splice(index + 1, 0, duplicatedBlock);
    onChange(newBlocks);
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const swapTarget = direction === "up" ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[swapTarget];
    newBlocks[swapTarget] = temp;
    
    onChange(newBlocks);

    // Swap expanded states
    setExpandedIndices((prev) => {
      const copy = { ...prev };
      const tempExp = copy[index];
      copy[index] = copy[swapTarget];
      copy[swapTarget] = tempExp;
      return copy;
    });
  };

  const handleDataChange = (index: number, key: string, value: any) => {
    const newBlocks = [...blocks];
    newBlocks[index].data[key] = value;
    onChange(newBlocks);
  };

  const getBlockDefaultData = (type: string) => {
    switch (type) {
      case "Hero":
        return { title: "", subtitle: "", description: "" };
      case "Overview":
      case "Problem":
      case "Goals":
      case "Challenges":
      case "Results":
      case "Conclusion":
        return { points: [""] };
      case "Research":
        return { cards: [{ number: "01", heading: "", description: "" }] };
      case "User Persona":
        return { name: "", role: "", quote: "", needs: [""], painPoints: [""], image: "" };
      case "Design System":
        return {
          colors: [{ name: "", hex: "" }],
          typography: ["Inter", "Bebas Neue"]
        };
      case "High Fidelity UI":
        return { title: "", subtitle: "", image: "" };
      case "Gallery":
        return { images: [""] };
      case "Testimonial":
        return { rating: 5, text: "", author: "", role: "" };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={16} className="text-white/40" />
        <h3 className="text-xs uppercase tracking-widest font-bold text-white/50">Modular Layout Content Builder</h3>
      </div>

      <div className="space-y-4">
        {blocks.map((block, idx) => {
          const isExpanded = expandedIndices[idx] ?? false;

          return (
            <div
              key={idx}
              className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] overflow-hidden"
            >
              {/* Block Header Toolbar */}
              <div className="flex items-center justify-between border-b border-white/[0.04] bg-white/[0.01] px-5 py-3 text-xs">
                <div 
                  onClick={() => toggleExpand(idx)}
                  className="flex items-center gap-3 cursor-pointer select-none flex-1 font-bold tracking-wider uppercase text-white/80"
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{block.type} Block</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleMoveBlock(idx, "up")}
                    disabled={idx === 0}
                    className="text-white/40 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMoveBlock(idx, "down")}
                    disabled={idx === blocks.length - 1}
                    className="text-white/40 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => handleDuplicateBlock(idx)}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Duplicate Block"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteBlock(idx)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                    title="Delete Block"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Block Editor Inputs */}
              {isExpanded && (
                <div className="p-6 bg-[#0E0E0E] space-y-6">
                  {renderBlockEditor(block, idx, handleDataChange)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Block Selector */}
      <div className="pt-4 border-t border-white/[0.06]">
        <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-3">Add Content Module</p>
        <div className="flex flex-wrap gap-2.5">
          {AVAILABLE_BLOCKS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAddBlock(type)}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/10 bg-white/[0.02] px-3.5 py-2 text-[9px] uppercase tracking-widest font-bold text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            >
              <Plus size={10} /> {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderBlockEditor(
  block: BlockType,
  index: number,
  onChange: (index: number, key: string, value: any) => void
) {
  const d = block.data || {};

  switch (block.type) {
    case "Hero":
      return (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Hero Title</span>
            <input
              type="text"
              value={d.title || ""}
              onChange={(e) => onChange(index, "title", e.target.value)}
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Subtitle</span>
            <input
              type="text"
              value={d.subtitle || ""}
              onChange={(e) => onChange(index, "subtitle", e.target.value)}
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
            />
          </label>
          <div className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Detailed Intro Description</span>
            <RichTextEditor
              value={d.description || ""}
              onChange={(val) => onChange(index, "description", val)}
              placeholder="Detailed description content..."
              rows={6}
            />
          </div>
        </div>
      );

    case "Overview":
    case "Problem":
    case "Goals":
    case "Challenges":
    case "Results":
    case "Conclusion":
      const pts = d.points || [""];
      return (
        <div className="space-y-5">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">List Points / Paragraphs</span>
          {pts.map((pt: string, pIdx: number) => (
            <div key={pIdx} className="space-y-2 border-l border-white/[0.06] pl-4.5 relative group/item">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] uppercase tracking-wider text-white/30 font-bold">Paragraph #{pIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newPts = pts.filter((_: any, i: number) => i !== pIdx);
                    onChange(index, "points", newPts.length ? newPts : [""]);
                  }}
                  className="text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <RichTextEditor
                value={pt}
                onChange={(val) => {
                  const newPts = [...pts];
                  newPts[pIdx] = val;
                  onChange(index, "points", newPts);
                }}
                placeholder={`Paragraph content #${pIdx + 1}...`}
                rows={4}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange(index, "points", [...pts, ""])}
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white cursor-pointer"
          >
            <Plus size={10} /> Add Paragraph
          </button>
        </div>
      );

    case "Research":
      const cards = d.cards || [{ number: "01", heading: "", description: "" }];
      return (
        <div className="space-y-6">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Research Insight Cards</span>
          {cards.map((card: any, cIdx: number) => (
            <div key={cIdx} className="space-y-4 border border-white/[0.06] rounded-[4px] bg-[#070707] p-4.5 relative">
              <button
                type="button"
                onClick={() => {
                  const newCards = cards.filter((_: any, i: number) => i !== cIdx);
                  onChange(index, "cards", newCards.length ? newCards : [{ number: "01", heading: "", description: "" }]);
                }}
                className="absolute top-4 right-4 text-white/30 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Card Number</span>
                  <input
                    type="text"
                    value={card.number || ""}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[cIdx].number = e.target.value;
                      onChange(index, "cards", newCards);
                    }}
                    placeholder="01"
                    className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs outline-none focus:border-white/20"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Card Heading</span>
                  <input
                    type="text"
                    value={card.heading || ""}
                    onChange={(e) => {
                      const newCards = [...cards];
                      newCards[cIdx].heading = e.target.value;
                      onChange(index, "cards", newCards);
                    }}
                    placeholder="User Painpoint"
                    className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs outline-none focus:border-white/20"
                  />
                </label>
              </div>

              <div className="block">
                <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Card Description Content</span>
                <RichTextEditor
                  value={card.description || ""}
                  onChange={(val) => {
                    const newCards = [...cards];
                    newCards[cIdx].description = val;
                    onChange(index, "cards", newCards);
                  }}
                  placeholder="Detail content for the insight card..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange(index, "cards", [...cards, { number: `0${cards.length + 1}`, heading: "", description: "" }])}
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white cursor-pointer"
          >
            <Plus size={10} /> Add Insight Card
          </button>
        </div>
      );

    case "User Persona":
      const needs = d.needs || [""];
      const painPoints = d.painPoints || [""];
      return (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Persona Name</span>
              <input
                type="text"
                value={d.name || ""}
                onChange={(e) => onChange(index, "name", e.target.value)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Persona Role</span>
              <input
                type="text"
                value={d.role || ""}
                onChange={(e) => onChange(index, "role", e.target.value)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Persona Quote</span>
            <input
              type="text"
              value={d.quote || ""}
              onChange={(e) => onChange(index, "quote", e.target.value)}
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
            />
          </label>
          
          <ImageUpload
            label="Avatar Image"
            value={d.image || ""}
            onChange={(url) => onChange(index, "image", url)}
          />

          {/* User Needs */}
          <div className="space-y-3">
            <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">User Needs list</span>
            {needs.map((nd: string, nIdx: number) => (
              <div key={nIdx} className="flex gap-2">
                <input
                  type="text"
                  value={nd}
                  onChange={(e) => {
                    const newNeeds = [...needs];
                    newNeeds[nIdx] = e.target.value;
                    onChange(index, "needs", newNeeds);
                  }}
                  placeholder="Need description..."
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newNeeds = needs.filter((_: any, i: number) => i !== nIdx);
                    onChange(index, "needs", newNeeds.length ? newNeeds : [""]);
                  }}
                  className="text-white/30 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange(index, "needs", [...needs, ""])}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white cursor-pointer"
            >
              <Plus size={10} /> Add Need
            </button>
          </div>

          {/* Pain Points */}
          <div className="space-y-3">
            <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Pain Points list</span>
            {painPoints.map((pt: string, pIdx: number) => (
              <div key={pIdx} className="flex gap-2">
                <input
                  type="text"
                  value={pt}
                  onChange={(e) => {
                    const newPoints = [...painPoints];
                    newPoints[pIdx] = e.target.value;
                    onChange(index, "painPoints", newPoints);
                  }}
                  placeholder="Painpoint description..."
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newPoints = painPoints.filter((_: any, i: number) => i !== pIdx);
                    onChange(index, "painPoints", newPoints.length ? newPoints : [""]);
                  }}
                  className="text-white/30 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange(index, "painPoints", [...painPoints, ""])}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white cursor-pointer"
            >
              <Plus size={10} /> Add Pain Point
            </button>
          </div>
        </div>
      );

    case "Design System":
      const colors = d.colors || [{ name: "", hex: "" }];
      const typographies = d.typography || ["Inter", "Bebas Neue"];
      return (
        <div className="space-y-6">
          {/* Color palette manager */}
          <div className="space-y-3">
            <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Brand Colors</span>
            {colors.map((c: any, cIdx: number) => (
              <div key={cIdx} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Color Name (e.g. Slate Gray)"
                  value={c.name}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[cIdx].name = e.target.value;
                    onChange(index, "colors", newColors);
                  }}
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs outline-none focus:border-white/20"
                />
                <input
                  type="text"
                  placeholder="#000000"
                  value={c.hex}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[cIdx].hex = e.target.value;
                    onChange(index, "colors", newColors);
                  }}
                  className="w-32 rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newColors = colors.filter((_: any, i: number) => i !== cIdx);
                    onChange(index, "colors", newColors.length ? newColors : [{ name: "", hex: "" }]);
                  }}
                  className="text-white/45 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange(index, "colors", [...colors, { name: "", hex: "" }])}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white cursor-pointer"
            >
              <Plus size={10} /> Add Color
            </button>
          </div>

          {/* Typography font entries */}
          <div className="space-y-3">
            <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Typography System</span>
            {typographies.map((t: string, tIdx: number) => (
              <div key={tIdx} className="flex gap-2">
                <input
                  type="text"
                  value={t}
                  onChange={(e) => {
                    const newTypos = [...typographies];
                    newTypos[tIdx] = e.target.value;
                    onChange(index, "typography", newTypos);
                  }}
                  placeholder="Font Family (e.g. Outfit)"
                  className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2 text-xs outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newTypos = typographies.filter((_: any, i: number) => i !== tIdx);
                    onChange(index, "typography", newTypos.length ? newTypos : ["Inter"]);
                  }}
                  className="text-white/30 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange(index, "typography", [...typographies, ""])}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white cursor-pointer"
            >
              <Plus size={10} /> Add Font Family
            </button>
          </div>
        </div>
      );

    case "High Fidelity UI":
      return (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Block Title</span>
            <input
              type="text"
              value={d.title || ""}
              onChange={(e) => onChange(index, "title", e.target.value)}
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Subtitle</span>
            <input
              type="text"
              value={d.subtitle || ""}
              onChange={(e) => onChange(index, "subtitle", e.target.value)}
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
            />
          </label>
          <ImageUpload
            label="High Fidelity Mockup Image"
            value={d.image || ""}
            onChange={(url) => onChange(index, "image", url)}
          />
        </div>
      );

    case "Gallery":
      const imgs = d.images || [""];
      return (
        <div className="space-y-4">
          <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold mb-2">Gallery Images (Visual Uploader Grid)</span>
          <div className="grid gap-6 sm:grid-cols-2">
            {imgs.map((img: string, iIdx: number) => (
              <div key={iIdx} className="relative group/gallery border border-white/[0.04] p-3 rounded-[6px] bg-white/[0.01]">
                <button
                  type="button"
                  onClick={() => {
                    const newImgs = imgs.filter((_: any, i: number) => i !== iIdx);
                    onChange(index, "images", newImgs.length ? newImgs : [""]);
                  }}
                  className="absolute top-5 right-5 text-white/40 hover:text-red-400 p-1 bg-black/60 rounded-[4px] border border-white/5 z-30"
                  title="Remove Image Slot"
                >
                  <Trash2 size={11} />
                </button>

                <ImageUpload
                  label={`Gallery Slide #${iIdx + 1}`}
                  value={img}
                  onChange={(url) => {
                    const newImgs = [...imgs];
                    newImgs[iIdx] = url;
                    onChange(index, "images", newImgs);
                  }}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange(index, "images", [...imgs, ""])}
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/5 bg-white/[0.01] px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white/55 hover:text-white cursor-pointer"
          >
            <Plus size={10} /> Add Image Slot
          </button>
        </div>
      );

    case "Testimonial":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Author Name</span>
              <input
                type="text"
                value={d.author || ""}
                onChange={(e) => onChange(index, "author", e.target.value)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Author Role / Company</span>
              <input
                type="text"
                value={d.role || ""}
                onChange={(e) => onChange(index, "role", e.target.value)}
                className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Rating (Stars)</span>
            <select
              value={d.rating || 5}
              onChange={(e) => onChange(index, "rating", Number(e.target.value))}
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs outline-none focus:border-white/20"
            >
              <option value="5">★★★★★ (5 Stars)</option>
              <option value="4">★★★★☆ (4 Stars)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
            </select>
          </label>
          <div className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Quote Text Content</span>
            <RichTextEditor
              value={d.text || ""}
              onChange={(val) => onChange(index, "text", val)}
              placeholder="Testimonial text..."
              rows={4}
            />
          </div>
        </div>
      );

    default:
      return <p className="text-xs text-white/30 font-bold">Fields not structured for this layout block yet.</p>;
  }
}
