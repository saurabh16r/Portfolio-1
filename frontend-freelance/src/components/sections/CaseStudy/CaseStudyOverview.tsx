import { CheckCircle } from "lucide-react";
import { type Project } from "@/data/projects";
import { resolveHtmlImages } from "@/services/api";

interface CaseStudyOverviewProps {
  project: Project;
}

export function CaseStudyOverview({ project }: CaseStudyOverviewProps) {
  return (
    <section className="px-6 py-24 sm:px-8 lg:px-12 bg-black">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] border-b border-white/5 pb-16">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Overview</h2>
            <div className="space-y-4 text-base leading-relaxed text-[#8b8b8b]">
              {project.overview.map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: resolveHtmlImages(para) }} />
              ))}
            </div>
          </div>
          {project.problem && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">The Problem</h2>
              <div className="space-y-4 text-base leading-relaxed text-[#8b8b8b]">
                {project.problem.map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: resolveHtmlImages(para) }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {project.goals && (
          <div className="border-b border-white/5 pb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">Project Goals</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {project.goals.map((goal, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 flex gap-4">
                  <CheckCircle className="text-white shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-[#8b8b8b] leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
