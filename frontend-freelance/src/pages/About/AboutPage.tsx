import { useState } from "react";
import { SEOHead } from "@/components/common/SEOHead";
import { motion } from "framer-motion";
import {
  Briefcase,
  Terminal,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { LuxuryButton } from "@/components/common/LuxuryButton";

const funFacts = [
  {
    emoji: "☕",
    title: "Coffee Intake",
    fact: "I consume an average of 3 cups of coffee daily to keep the frames rendering smoothly.",
  },
  {
    emoji: "🎧",
    title: "Soundtrack",
    fact: "80% of my layouts are built listening to synthwave and atmospheric lofi beats.",
  },
  {
    emoji: "🚀",
    title: "First Code",
    fact: "I built my first static landing page in HTML at the age of 14, and it looked terribly green.",
  },
  {
    emoji: "🌎",
    title: "Nomadic Vibe",
    fact: "I've collaborated with clients across 7 different time zones, from California to Mumbai.",
  },
];

export function AboutPage() {
  const [activeFact, setActiveFact] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <SEOHead
        title="About Me — Saurabh Rathore"
        description="Read my story, design education history, freelance achievements, and core toolkit skills."
        canonicalUrl="https://saurabh-rathore.com/about"
      />

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      {/* Hero Portrait Section */}
      <section className="px-6 pb-12 sm:pb-16 lg:pb-20 pt-32 sm:pt-40 lg:pt-48 bg-transparent">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-[4/5] max-w-sm w-full mx-auto rounded-[2rem] overflow-hidden border border-white/[0.08] bg-white/[0.02]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: `url(/photo.jpg)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              <p className="mb-4 text-[0.62rem] uppercase tracking-[0.35em] text-white/40 font-bold">
                The Designer
              </p>
              <h1 className="font-display font-medium text-[clamp(3.5rem,10vw,7rem)] uppercase leading-[0.88] tracking-tight text-white mb-6">
                Saurabh <span className="text-accent">Rathore</span>
              </h1>
              <p className="text-lg leading-8 text-white max-w-xl mb-6">
                Based in India, I design digital layouts and build front-end architectures. I pair high-end interactive aesthetics with performance engineering.
              </p>
              <p className="text-sm leading-relaxed text-white/60 max-w-lg mb-8">
                I help startups bridge the gap between creative visual designs and clean React code. I focus on motion-first, accessible interface details that elevate user engagement.
              </p>
              <LuxuryButton href="/resume.pdf">
                Download Resume
              </LuxuryButton>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats achievements Section */}
      <section className="px-6 py-12 sm:py-16 lg:py-20 bg-transparent border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 grid-cols-2 lg:grid-cols-4 text-center">
            {[
              { value: "20+", label: "Completed Projects" },
              { value: "3+", label: "Years Experience" },
              { value: "98%", label: "Happy Clients" },
              { value: "100%", label: "Clean Code Guarantee" },
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <div className="font-display font-medium text-5xl text-white tracking-[0.05em] mb-2">
                  {stat.value}
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Story Section */}
      <section className="px-6 py-16 sm:py-24 lg:py-32 bg-transparent">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="My Timeline" title="Career Story" number="01" className="mb-24" />

          <div className="relative">
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] -translate-x-1/2" />

            <div className="space-y-16">
              {[
                {
                  period: "May 2026 – Present",
                  role: "UI/UX Designer & Framer Developer",
                  company: "Deven Studios",
                  desc: "Designing responsive landing page structures, building interactive prototype flows, and executing premium Framer components.",
                },
                {
                  period: "Feb 2026 – Apr 2026",
                  role: "UI/UX & Framer Developer Intern",
                  company: "Deven Studios",
                  desc: "Collaborated in asset design, client audit reports, typography spacing guides, and publishing marketing assets.",
                },
                {
                  period: "Apr 2025 – Jul 2025",
                  role: "UI/UX Designer · Top Performer",
                  company: "Zaalima Development",
                  desc: "Assisted in vector graphics asset design, wireframing workflows, user testing metrics, and UI mockups.",
                },
                {
                  period: "2022 - 2025",
                  role: "Self-Taught Freelance Engineer",
                  company: "Independent Projects",
                  desc: "Explored visual design tools, mastered HTML/CSS layouts, and built personal static websites for global clients.",
                },
              ].map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-start md:items-center relative"
                  >
                    <div className="absolute left-[15px] md:left-1/2 h-8 w-8 rounded-full border border-white/[0.08] bg-card -translate-x-1/2 flex items-center justify-center z-10">
                      <Briefcase size={12} className="text-white/40" />
                    </div>

                    <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:order-last"}`}>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold">
                        {item.period}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{item.company}</h3>
                      <h4 className="text-sm font-semibold text-white/60 mt-1">{item.role}</h4>
                      <p className="text-xs text-white/40 leading-relaxed mt-3 max-w-md inline-block">
                        {item.desc}
                      </p>
                    </div>

                    <div className="hidden md:block w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Skills and Tools Section */}
      <section className="px-6 py-16 sm:py-24 lg:py-32 bg-transparent border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading eyebrow="Skills List" title="Core Toolkit" number="02" className="mb-8" />
              <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-6">
                I balance modern UI style capabilities with active coding libraries.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {["UI Design", "UX Research", "React", "Framer", "Tailwind", "Figma", "Motion Design"].map((sk) => (
                  <span
                    key={sk}
                    className="rounded-full border border-white/[0.08] bg-card px-4 py-2 text-xs font-medium text-white/80"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-white/30 font-bold mb-8">Animated Tools Showcase</h3>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                {[
                  { name: "Figma", desc: "High-fi layouts" },
                  { name: "VS Code", desc: "React coding" },
                  { name: "Framer", desc: "No-code hosting" },
                  { name: "Tailwind", desc: "Utility styling" },
                  { name: "GitHub", desc: "Version control" },
                  { name: "React 19", desc: "Logical components" },
                ].map((tool) => (
                  <motion.div
                    key={tool.name}
                    whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.15)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-[6px] border border-white/[0.08] bg-card p-5 text-center flex flex-col justify-center cursor-none"
                  >
                    <Terminal size={18} className="mx-auto text-white/30 mb-3" />
                    <h4 className="text-sm font-semibold text-white">{tool.name}</h4>
                    <p className="text-[10px] text-white/40 mt-1">{tool.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Facts Interactive section */}
      <section className="px-6 py-16 sm:py-24 lg:py-32 bg-transparent">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Trivia" title="Fun Facts" number="03" className="mb-20 text-center" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {funFacts.map((fact, index) => {
              const isOpen = activeFact === index;
              return (
                <div
                  key={index}
                  onClick={() => setActiveFact(isOpen ? null : index)}
                  className="cursor-none rounded-[6px] border border-white/[0.08] bg-card p-6 text-center transition-all duration-300 hover:border-white/15 select-none flex flex-col justify-between min-h-48"
                >
                  <div className="text-3xl mb-4">{fact.emoji}</div>
                  <h4 className="text-sm font-semibold text-white mb-2">{fact.title}</h4>
                  <div className="min-h-16 flex items-center justify-center">
                    {isOpen ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-white/60 leading-relaxed"
                      >
                        {fact.fact}
                      </motion.p>
                    ) : (
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition-colors">
                        Reveal Fact
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About CTA */}
      <section className="px-6 py-16 sm:py-24 lg:py-32 bg-transparent border-t border-white/[0.04] text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-wide text-white mb-6">
            Let's work together.
          </h2>
          <p className="text-white/60 text-sm mb-10 max-w-md mx-auto leading-relaxed">
            I'm currently accepting new freelance projects and contract design arrangements. Let's build.
          </p>
          <LuxuryButton to="/contact">
            Get In Touch
          </LuxuryButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
