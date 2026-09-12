import { Laptop, Tablet, Smartphone } from "lucide-react";
import { type Project } from "@/data/projects";
import { getImageUrl } from "@/services/api";

interface CaseStudyShowcaseProps {
  project: Project;
}

export function CaseStudyShowcase({ project }: CaseStudyShowcaseProps) {
  return (
    <>
      {/* Challenges, Solutions and Results */}
      <section className="px-6 py-24 sm:px-8 lg:px-12 bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/5 bg-[#0d0d0d] p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Challenges</h3>
              <ul className="space-y-3 text-sm text-[#8b8b8b] leading-relaxed">
                {project.challenge.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0 mt-2" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.6rem] border border-white/5 bg-[#0d0d0d] p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Solutions</h3>
              <ul className="space-y-3 text-sm text-[#8b8b8b] leading-relaxed">
                {project.solution.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0 mt-2" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.6rem] border border-white/5 bg-[#0d0d0d] p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
              <ul className="space-y-3 text-sm text-[#8b8b8b] leading-relaxed">
                {project.results.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0 mt-2" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Gallery */}
      {project.galleryImages && (
        <section className="py-20 bg-[#050505] border-y border-white/5">
          <div className="px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl mb-8">
            <h2 className="text-2xl font-semibold text-white">Visual Gallery</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto px-6 sm:px-8 lg:px-12 py-4 no-scrollbar">
            {project.galleryImages.map((img, idx) => (
              <div key={idx} className="min-w-[280px] sm:min-w-[480px] h-60 sm:h-80 rounded-2xl overflow-hidden border border-white/5 bg-[#0d0d0d] shrink-0">
                <img src={getImageUrl(img, 800)} alt="Gallery item" className="h-full w-full object-cover opacity-80" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Case Study Responsive UI Mockup Showcase */}
      {project.finalUi && (
        <section className="px-6 py-24 sm:px-8 lg:px-12 bg-black">
          <div className="mx-auto max-w-7xl space-y-12">
            <h2 className="text-2xl font-semibold text-white text-center">Responsive UI Showcase</h2>
            <div className="grid gap-8 lg:grid-cols-3 items-end">
               {project.finalUi.map((ui, idx) => (
                <div key={idx} className="contents">
                  {ui.desktop && (
                    <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 text-center">
                      <div className="flex items-center gap-1.5 text-xs text-[#666] mb-3">
                        <Laptop size={14} /> Desktop Preview
                      </div>
                      <div className="h-44 rounded-lg bg-cover bg-center overflow-hidden border border-white/5" style={{ backgroundImage: `url(${getImageUrl(ui.desktop, 1000)})` }} />
                    </div>
                  )}
                  {ui.tablet && (
                    <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 text-center max-w-sm mx-auto w-full">
                      <div className="flex items-center gap-1.5 text-xs text-[#666] mb-3">
                        <Tablet size={14} /> Tablet Preview
                      </div>
                      <div className="h-64 rounded-lg bg-cover bg-center overflow-hidden border border-white/5" style={{ backgroundImage: `url(${getImageUrl(ui.tablet, 600)})` }} />
                    </div>
                  )}
                  {ui.mobile && (
                    <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 text-center max-w-xs mx-auto w-full">
                      <div className="flex items-center gap-1.5 text-xs text-[#666] mb-3">
                        <Smartphone size={14} /> Mobile Preview
                      </div>
                      <div className="h-[300px] rounded-lg bg-cover bg-center overflow-hidden border border-white/5" style={{ backgroundImage: `url(${getImageUrl(ui.mobile, 400)})` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
