export function ProcessTimeline() {
  return (
    <section className="px-6 py-24 sm:px-8 lg:px-12 bg-black">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-semibold text-white mb-16 text-center">Process Timeline</h2>
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-8 relative">
          <div className="absolute top-[20px] left-[15px] bottom-0 md:left-0 md:right-0 md:top-[15px] md:bottom-auto h-px bg-white/10 w-[1px] md:w-full hidden md:block" />
          {[
            { label: "Discover", desc: "User research, briefs alignment" },
            { label: "Research", desc: "Insight collections, audits" },
            { label: "Wireframes", desc: "Functional layouts, paper drafts" },
            { label: "Prototype", desc: "Figma flows, motion guides" },
            { label: "UI Design", desc: "Styling grids, colors, typography" },
            { label: "Testing", desc: "Focus user tests, contrast fixes" },
            { label: "Launch", desc: "React setup, clean code export" },
          ].map((step, idx) => (
            <div key={idx} className="flex gap-4 md:flex-col md:items-center relative z-10 md:text-center w-full">
              <div className="h-8 w-8 rounded-full border border-white/20 bg-black flex items-center justify-center font-bold text-xs text-white">
                {idx + 1}
              </div>
              <div className="mt-1 md:mt-4">
                <h4 className="text-sm font-semibold text-white">{step.label}</h4>
                <p className="text-[10px] text-[#666] leading-relaxed mt-1 max-w-[120px] md:mx-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
