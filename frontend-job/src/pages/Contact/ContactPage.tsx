import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { ContactForm } from "@/components/common/ContactForm";
import { Magnetic } from "@/components/common/Magnetic";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Do you sign NDA agreements before reviewing role specs or product designs?",
    answer: "Yes, I regularly sign standard non-disclosure agreements before reviewing internal documentation, Figma design files, or product roadmaps.",
  },
  {
    question: "What types of roles are you open to?",
    answer: "I am primarily focused on UI/UX Designer, Product Designer, Web Designer, UI Designer, UX Designer, and Framer Developer roles (Full-Time or Contract).",
  },
  {
    question: "Are you available for remote work?",
    answer: "Yes, I collaborate seamlessly across timezones with design teams, product managers, and founders worldwide.",
  },
];

export function ContactPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <Helmet>
        <title>Get in Touch — Saurabh Rathore | UI/UX Designer & Framer Developer</title>
        <meta name="description" content="Get in touch for UI/UX Designer, Product Designer, Web Designer, and Framer Developer opportunities." />
        <link rel="canonical" href="https://saurabh-rathore.com/contact" />
      </Helmet>

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      {/* Trust Panel & Form Section (Consistent with Home Page Onboarding Redesign) */}
      <section className="px-6 pb-16 sm:pb-24 lg:pb-32 pt-32 sm:pt-40 lg:pt-48 bg-transparent">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:gap-20 lg:gap-[120px] lg:grid-cols-[0.95fr_1.05fr] items-start pt-[20px]">
            
            {/* Left Column: Trust Panel & Editorial Heading */}
            <div className="space-y-10 text-left select-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[#666]">
                  Get In Touch
                </p>
                <h1 className="font-display font-medium text-[clamp(2.5rem,5.5vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-white mb-6">
                  LET'S CREATE <br />
                  SOMETHING WORTH <br />
                  <span className="text-accent">EXPERIENCING.</span>
                </h1>
                <p className="text-sm text-white/50 leading-relaxed max-w-sm">
                  Looking for a UI/UX Designer or Framer Developer? Fill out the brief form on the right to get in touch.
                </p>
              </motion.div>

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

            {/* Right Column: Premium Form Panel */}
            <div className="w-full flex justify-start lg:justify-end">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="px-6 py-16 sm:py-24 lg:py-32 bg-transparent border-t border-white/[0.04]">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Quick Answers" title="Form FAQs" number="01" className="mb-16 text-center" />

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-[16px] border border-white/[0.08] bg-[#0E0E0E] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-6 text-left outline-none cursor-none bg-transparent"
                    type="button"
                  >
                    <span className="text-sm font-medium text-white">{item.question}</span>
                    <span className="text-white shrink-0 ml-4 transition-transform duration-300">
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-xs text-white/60 leading-relaxed border-t border-white/[0.05] pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
