import { ContactForm } from "@/components/common/ContactForm";
import { Magnetic } from "@/components/common/Magnetic";

export function ContactSection() {
  return (
    <section className="px-6 pt-0 pb-[160px] sm:px-8 lg:px-12 bg-transparent border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-[80px] lg:gap-[120px] lg:grid-cols-[0.95fr_1.05fr] items-start pt-[120px]">
          
          {/* Left Column: Trust Panel & Editorial Heading */}
          <div className="space-y-10 text-left select-none">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[#666]">
                Get In Touch
              </p>
              <h2 className="font-display font-medium text-[clamp(2.5rem,5.5vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-white mb-6">
                LET'S CREATE <br />
                SOMETHING WORTH <br />
                <span className="text-accent">EXPERIENCING.</span>
              </h2>
              <p className="text-sm text-white/50 leading-relaxed max-w-sm">
                Looking for a UI/UX Designer or Framer Developer? Let's discuss open roles, team opportunities, or project collaborations.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-6 border-t border-white/5 pt-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-1">Availability</span>
                <span className="text-xs text-white/80 font-medium">Open for UI/UX & Framer Roles</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-1">Response Time</span>
                <span className="text-xs text-white/80 font-medium">Usually within 24 Hours</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-1">Location</span>
                <span className="text-xs text-white/80 font-medium">India · Working Worldwide</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-1">Specialization</span>
                <span className="text-xs text-accent font-semibold">UI/UX & Framer</span>
              </div>
            </div>

            {/* Core expertise lists */}
            <div className="border-t border-white/5 pt-8 space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-3.5">Focus Areas</span>
                <div className="flex flex-wrap gap-2.5">
                  {["UI/UX Design", "Framer Development", "Web Design", "Interaction Design"].map((s) => (
                    <span key={s} className="text-[9px] font-bold uppercase tracking-wider text-white/60 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Channels with Magnetic Pulls */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-3">Connect</span>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <Magnetic range={35} strength={0.35}>
                    <a
                      href="https://www.linkedin.com/in/saurabh-singh-rathore-04a982332/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/50 hover:text-white transition-colors cursor-none py-1 block"
                    >
                      LinkedIn
                    </a>
                  </Magnetic>
                  <span className="text-white/10">•</span>
                  <Magnetic range={35} strength={0.35}>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/50 hover:text-white transition-colors cursor-none py-1 block"
                    >
                      GitHub
                    </a>
                  </Magnetic>
                  <span className="text-white/10">•</span>
                  <Magnetic range={35} strength={0.35}>
                    <a
                      href="mailto:thisissaurabhrathore@gmail.com"
                      className="text-white/50 hover:text-white transition-colors cursor-none py-1 block"
                    >
                      Email
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="w-full flex justify-start lg:justify-end">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
