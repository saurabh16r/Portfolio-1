import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { api, getImageUrl } from "@/services/api.js";
import { User, Sparkles, Layout, Code2, Target } from "lucide-react";

export function AboutSection() {
  const [aboutData, setAboutData] = useState<any>({
    title: "About Me",
    eyebrow: "Background & Focus",
    heading: "Saurabh Rathore",
    profileImage: "",
    story: "I am a product designer and frontend engineer with a passion for building intuitive, high-performance web applications and interactive design systems.",
    designBackground: "Over 3+ years, I've crafted UI/UX systems, high-converting interfaces, and accessible component libraries with Figma and modern design workflows.",
    devJourney: "Specialized in modern web technologies including React, TypeScript, Node.js, and Framer Motion, writing clean and maintainable code.",
    currentFocus: "Currently building modern digital products, refining design systems, and seeking high-impact roles in design and engineering teams.",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("/content");
        if (res && res.jobAbout) {
          setAboutData(res.jobAbout);
        }
      } catch (err) {
        console.log("Using default job about copy");
      }
    };
    fetchContent();
  }, []);

  const imageUrl = aboutData.profileImage ? getImageUrl(aboutData.profileImage) : null;

  return (
    <section id="about" className="px-6 pt-0 pb-[160px] sm:px-8 lg:px-12 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={aboutData.eyebrow || "Background & Focus"} title={aboutData.title || "About Me"} number="03" className="mb-16" />

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-stretch">
          {/* Left Column: Profile Photo Card */}
          <div className="relative rounded-[6px] border border-white/[0.08] bg-[#0B0B0B] p-4 flex flex-col justify-between overflow-hidden group">
            <div className="relative w-full aspect-[4/5] rounded-[4px] bg-[#050505] overflow-hidden flex items-center justify-center border border-white/[0.04]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={aboutData.heading || "Profile"}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/30">
                  <User size={48} className="stroke-[1.5]" />
                  <span className="text-[9px] uppercase tracking-[0.25em] font-bold">Profile Image</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <h4 className="font-display text-xl uppercase tracking-wider text-white">
                  {aboutData.heading || "Saurabh Rathore"}
                </h4>
                <p className="text-[9px] uppercase tracking-[0.25em] text-accent font-bold mt-0.5">
                  Designer & Developer
                </p>
              </div>
              <Sparkles size={16} className="text-accent/60" />
            </div>
          </div>

          {/* Right Column: Editorial Journey */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Story */}
            <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 sm:p-8">
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-3 flex items-center gap-2">
                <User size={13} className="text-accent" /> Personal Story
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-white/80 font-sans">
                {aboutData.story}
              </p>
            </div>

            {/* Design Background & Dev Journey Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6">
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-3 flex items-center gap-2">
                  <Layout size={13} className="text-accent" /> Design Background
                </h4>
                <p className="text-xs leading-relaxed text-white/60">
                  {aboutData.designBackground}
                </p>
              </div>

              <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6">
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-3 flex items-center gap-2">
                  <Code2 size={13} className="text-accent" /> Engineering Journey
                </h4>
                <p className="text-xs leading-relaxed text-white/60">
                  {aboutData.devJourney}
                </p>
              </div>
            </div>

            {/* Current Focus */}
            <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 sm:p-8">
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-3 flex items-center gap-2">
                <Target size={13} className="text-accent" /> Current Focus
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-white/70">
                {aboutData.currentFocus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
