import { type Project } from "@/data/projects";

interface ResearchInsightsProps {
  project: Project;
}

export function ResearchInsights({ project }: ResearchInsightsProps) {
  if (!project.research && !project.userPersona) return null;

  return (
    <section className="px-6 py-24 sm:px-8 lg:px-12 bg-background border-y border-white/5">
      <div className="mx-auto max-w-7xl space-y-20">
        {project.research && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Research Insights</h2>
            <p className="text-[#8b8b8b] mb-12 max-w-xl text-sm leading-relaxed">
              Interviews and data audits helped map the biggest pain points. Here are the key findings:
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {project.research.map((res, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-card p-8">
                  <span className="font-display font-medium text-3xl text-white/20 mb-4 block">
                    {res.number}
                  </span>
                  <h4 className="text-base font-semibold text-white mb-3">{res.heading}</h4>
                  <p className="text-xs text-[#8b8b8b] leading-relaxed">{res.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.userPersona && (
          <div className="rounded-[2.5rem] border border-white/10 bg-card p-8 md:p-12">
            <h3 className="text-xs uppercase tracking-[0.3em] text-[#666] mb-8">User Persona</h3>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h4 className="text-2xl font-semibold text-white">{project.userPersona.name}</h4>
                <p className="text-xs uppercase tracking-[0.2em] text-[#666] mt-1">
                  {project.userPersona.role}
                </p>
                <blockquote className="mt-6 border-l-2 border-white/20 pl-4 italic text-sm text-[#c0c0c0] leading-relaxed">
                  "{project.userPersona.quote}"
                </blockquote>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h5 className="text-sm font-semibold text-white mb-3">User Needs</h5>
                  <ul className="space-y-2 text-xs text-[#8b8b8b]">
                    {project.userPersona.needs.map((nd, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" /> {nd}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white mb-3">Pain Points</h5>
                  <ul className="space-y-2 text-xs text-[#8b8b8b]">
                    {project.userPersona.painPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400/40" /> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
