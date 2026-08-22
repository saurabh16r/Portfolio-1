import { type Project } from "@/data/projects";

interface DesignSystemDetailsProps {
  project: Project;
}

export function DesignSystemDetails({ project }: DesignSystemDetailsProps) {
  if (!project.designSystem) return null;

  return (
    <section className="px-6 py-24 sm:px-8 lg:px-12 bg-[#050505] border-y border-white/5">
      <div className="mx-auto max-w-7xl space-y-16">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Design System</h2>
          <p className="text-[#8b8b8b] text-sm max-w-md">
            A set of UI tokens engineered specifically for {project.title}.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#666]">Color Palette</h4>
            <div className="grid gap-4 sm:grid-cols-4">
              {project.designSystem.colors.map((col, idx) => (
                <div key={idx} className="rounded-xl border border-white/5 bg-[#0d0d0d] overflow-hidden">
                  <div className="h-16 w-full" style={{ backgroundColor: col.hex }} />
                  <div className="p-3 text-[10px]">
                    <p className="font-semibold text-white truncate">{col.name}</p>
                    <p className="text-[#666] mt-0.5">{col.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#666]">Style Elements</h4>
            <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 space-y-4 text-xs">
              <div>
                <span className="text-[#666] block mb-1">Typography</span>
                <p className="text-white font-medium">{project.designSystem.typography.join(" · ")}</p>
              </div>
              <div>
                <span className="text-[#666] block mb-1">Buttons</span>
                <p className="text-white font-medium">{project.designSystem.buttons.join(" · ")}</p>
              </div>
              <div>
                <span className="text-[#666] block mb-1">Components</span>
                <p className="text-white font-medium">{project.designSystem.components.join(" · ")}</p>
              </div>
              <div>
                <span className="text-[#666] block mb-1">Spacing Grid</span>
                <p className="text-white font-medium">{project.designSystem.spacing}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
