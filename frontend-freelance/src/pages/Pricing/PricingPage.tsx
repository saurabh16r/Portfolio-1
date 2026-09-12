import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, HelpCircle, ShieldCheck, Zap, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { PricingSection } from "@/components/sections/Home/PricingSection";
import { SectionHeading } from "@/components/common/SectionHeading";
import { LuxuryButton } from "@/components/common/LuxuryButton";

const faqs = [
  {
    question: "What is included in the project pricing?",
    answer: "Every package includes bespoke UI/UX design, mobile-responsive engineering (Framer / React / Next.js), SEO setup, custom animations, and post-launch support. Details vary by package tier."
  },
  {
    question: "What are your payment terms?",
    answer: "We typically work on a standard 50/50 model: 50% deposit upfront before kickoff and 50% upon final delivery prior to domain deployment or code transfer. Retainers are billed monthly."
  },
  {
    question: "How long does a typical project take?",
    answer: "Landing page projects generally take 1–2 weeks. Full multi-page business websites range from 3–5 weeks depending on content scope, custom 3D/WebGL animations, and CMS requirements."
  },
  {
    question: "Do you offer post-launch support and updates?",
    answer: "Yes, every project includes 14 to 30 days of complimentary post-launch support. Beyond that, we offer flexible ongoing maintenance retainers or ad-hoc support packages."
  },
  {
    question: "Can we request custom features not listed in the packages?",
    answer: "Absolutely. We specialize in custom interactive web experiences. If your project has unique API integrations, custom WebGL visualizers, or specific CMS needs, contact us for a tailored proposal."
  }
];

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <Helmet>
        <title>Pricing & Packages — Saurabh Rathore Freelance Studio</title>
        <meta name="description" content="Transparent, value-driven pricing plans for landing pages, multi-page web applications, and agency whitelabel development." />
        <meta property="og:title" content="Pricing & Packages — Saurabh Rathore Freelance Studio" />
        <meta property="og:description" content="Transparent, value-driven pricing plans for landing pages, multi-page web applications, and agency whitelabel development." />
        <link rel="canonical" href="https://saurabh-rathore.com/pricing" />
      </Helmet>

      <SmoothScroll />
      <CinematicBackground />

      <Navbar />

      {/* Header Banner */}
      <section className="px-6 pt-32 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-6">
              <Sparkles size={12} /> Transparent Investment
            </div>
            <h1 className="font-display font-medium text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white max-w-4xl">
              Simple Packages. High Impact.
            </h1>
            <p className="mt-6 text-sm sm:text-base text-white/60 max-w-2xl font-sans leading-relaxed">
              No hidden fees, no unnecessary bloat. Choose a fixed-scope package or request a custom proposal crafted around your unique business goals.
            </p>
          </motion.div>

          {/* Key Value Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/[0.06]">
            <div className="flex items-start gap-4 p-6 rounded-xl border border-white/[0.06] bg-white/[0.01]">
              <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-display text-lg uppercase tracking-wider text-white">Fixed Delivery Timelines</h3>
                <p className="mt-1 text-xs text-white/50 leading-relaxed font-sans">Guaranteed milestones with high-speed turnaround times.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl border border-white/[0.06] bg-white/[0.01]">
              <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-display text-lg uppercase tracking-wider text-white">100% Quality Guarantee</h3>
                <p className="mt-1 text-xs text-white/50 leading-relaxed font-sans">Bespoke design, responsive across devices, pixel-perfect build.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl border border-white/[0.06] bg-white/[0.01]">
              <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-display text-lg uppercase tracking-wider text-white">Dedicated Support</h3>
                <p className="mt-1 text-xs text-white/50 leading-relaxed font-sans">Post-launch assistance and direct, async communication.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pricing Tier Grid */}
      <PricingSection />

      {/* FAQ Section */}
      <section className="px-6 py-20 sm:px-8 lg:px-12 bg-transparent border-t border-white/[0.04]">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-3">
              <HelpCircle size={14} /> Clear Answers
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl uppercase tracking-wider text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.08] bg-[#0B0B0B] overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-white font-display text-lg uppercase tracking-wide hover:text-accent transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 text-white/40 ${
                      openFaq === idx ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-xs text-white/60 leading-relaxed font-sans border-t border-white/[0.04] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center p-8 rounded-2xl border border-white/[0.08] bg-white/[0.01]">
            <h3 className="font-display text-xl uppercase tracking-wider text-white mb-2">Need a custom scope?</h3>
            <p className="text-xs text-white/50 mb-6 font-sans">Let's discuss your project details and build a custom offer catered to your exact needs.</p>
            <LuxuryButton to="/contact">Get a Custom Quote</LuxuryButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
