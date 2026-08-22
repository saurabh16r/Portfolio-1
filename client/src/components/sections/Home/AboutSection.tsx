import { SectionHeading } from "@/components/common/SectionHeading";
import { SkillTag } from "@/components/common/SkillTag";
import { ExperienceTimeline } from "@/components/common/ExperienceTimeline";
import { skills } from "@/data/skills";

export function AboutSection() {
  return (
    <section className="px-6 pt-0 pb-[160px] sm:px-8 lg:px-12 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Biography" title="About Me" number="04" className="mb-16" />

        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Left Column: Bio & Skills */}
          <div className="space-y-8">
            <h3 className="font-display font-medium text-3xl uppercase tracking-[0.1em] text-white">
              Saurabh Rathore
            </h3>
            
            <p className="text-base leading-8 text-[#8b8b8b] max-w-xl">
              I am a visual product designer and frontend engineer focused on high-end interactive websites and functional systems. I combine visual aesthetics with high-performance code structures.
            </p>

            <p className="text-xs leading-relaxed text-[#666] max-w-lg">
              Based in India, I help digital agencies and tech startups build conversion-driven landing pages, interactive SaaS dashboards, and complete component design libraries using Figma, Framer, and React.
            </p>

            {/* Reusable SkillTag List */}
            <div className="pt-6">
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#666] font-bold mb-4">
                Core Toolkit
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <SkillTag key={skill} label={skill} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Reusable Vertical Experience Timeline */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#666] font-bold mb-8 pl-8 md:pl-10">
              Work History
            </h4>
            <ExperienceTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}
