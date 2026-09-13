import { useState } from "react";
import { SEOHead } from "@/components/common/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Layers3,
  Handshake,
  Layout,
  Cpu,
  RefreshCw,
  Plus,
  Minus,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/components/common/ServiceCard";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { LuxuryButton } from "@/components/common/LuxuryButton";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "What is your typical turnaround timeline for a website?",
    answer: "A standard landing page usually takes 1-2 weeks from initial concept to launch. A multi-page custom business website typically takes 3-4 weeks depending on content scope, integrations, and motion design requirements.",
  },
  {
    question: "Do you build custom React solutions or do you only use Framer?",
    answer: "I specialize in both. If you need a fully scalable web application, I write clean, production-ready React, Vite, and Tailwind code. If you need a premium marketing site, I build in Framer for speed and easy content editing.",
  },
  {
    question: "What does the design process look like?",
    answer: "We start with Discovery (briefs and references alignment), move into Research & Wireframing, build the high-fidelity UI Design in dark/light mode with typography guidelines, and finally handle the Development and Launch checks.",
  },
  {
    question: "Can we sign a custom NDA before discussing project details?",
    answer: "Yes, absolutely. I work with startups and agencies worldwide and am happy to sign a standard non-disclosure agreement before reviewing private documents or API specifications.",
  },
];

export function ServicesPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <SEOHead
        title="Design & Development Services — Saurabh Rathore"
        description="Premium UI/UX design, custom landing pages, dashboard applications, and high-fidelity Framer development."
        canonicalUrl="https://saurabh-rathore.com/services"
      />

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 pb-20 pt-48 sm:px-8 lg:px-12 bg-transparent">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="mb-4 text-[0.62rem] uppercase tracking-[0.35em] text-white/40 font-bold">
              Core Offerings
            </p>
            <h1 className="font-display font-medium text-[clamp(3.5rem,10vw,7.5rem)] uppercase leading-[0.88] tracking-tight text-white mb-8">
              Expertise & <span className="text-accent">Services</span>
            </h1>
            <p className="max-w-xl text-white/60 text-base sm:text-lg leading-relaxed font-sans">
              I provide high-end digital design and development services. Focused on clean typography, smooth scrolling, and conversion optimization.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section: 3 Columns */}
      <section className="px-6 py-28 sm:px-8 lg:px-12 bg-transparent">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Layout,
                title: "UI/UX Design",
                desc: "High-fidelity application interfaces, components library structuring, prototyping in Figma, and clean user research frameworks.",
                price: "₹12,000",
              },
              {
                icon: Monitor,
                title: "Website Design",
                desc: "Custom landing page structures, typography rhythm, spacing hierarchies, dark mode color styles, and mobile responsiveness.",
                price: "₹15,000",
              },
              {
                icon: Cpu,
                title: "Frontend Development",
                desc: "Clean React 19 application layout coding, custom animations with Framer Motion, and Tailwind CSS system integrations.",
                price: "₹25,000",
              },
              {
                icon: Layers3,
                title: "Landing Pages",
                desc: "High-converting single pages optimized for Google Lighthouse scores, fast load times, and clear action items.",
                price: "₹15,000",
              },
              {
                icon: RefreshCw,
                title: "Website Redesign",
                desc: "Audit of outdated sites, restructuring information layout, refreshing branding assets, and migrating onto faster stacks.",
                price: "₹20,000",
              },
              {
                icon: Handshake,
                title: "Design Systems",
                desc: "Tailored UI kits, interactive Figma libraries, typography guidelines, and scalable button/card components for future developers.",
                price: "₹30,000",
              },
            ].map((srv, idx) => (
              <ServiceCard
                key={srv.title}
                number={`0${idx + 1}`}
                icon={srv.icon}
                title={srv.title}
                desc={srv.desc}
                price={srv.price}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-32 sm:px-8 lg:px-12 bg-transparent border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Transparent Rates" title="Pricing Structure" number="01" className="mb-20" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                tier: "Landing Page",
                price: "₹15,000",
                features: ["Single Page Layout", "Framer or React Build", "SEO Meta Setup", "5 Days Delivery"],
              },
              {
                tier: "Business Website",
                price: "₹30,000",
                features: ["Up to 5 Pages", "Custom Mockups in Figma", "Scroll Animations", "2 Weeks Delivery"],
              },
              {
                tier: "Dashboard App",
                price: "₹50,000",
                features: ["Tailored Application UI", "Interactive Metrics Charts", "Component States Library", "3 Weeks Delivery"],
              },
              {
                tier: "Enterprise Suite",
                price: "Custom Quote",
                features: ["Full Branding Identity", "Unlimited Pages & Apps", "Scalable Dev Onboarding", "Dedicated Support"],
              },
            ].map((plan, idx) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
                className="rounded-[6px] border border-white/[0.08] bg-card p-10 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3 font-bold">{plan.tier}</h4>
                  <div className="font-display font-medium text-3xl text-white tracking-[0.05em] mb-8">
                    {plan.price !== "Custom Quote" ? `Starting from ${plan.price}` : plan.price}
                  </div>
                  <ul className="space-y-3.5 text-xs text-white/60 border-t border-white/[0.05] pt-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Plus size={10} className="text-white/30" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10">
                  <LuxuryButton
                    to="/contact"
                    className="w-full text-center"
                    showArrow={false}
                  >
                    Select Plan
                  </LuxuryButton>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-12 text-center text-xs text-white/30 italic">
            * Final pricing depends on project scope, custom motion scripts, and additional pages.
          </p>
        </div>
      </section>

      {/* Production Process workflow */}
      <section className="px-6 py-32 sm:px-8 lg:px-12 bg-transparent">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Execution Workflow" title="Process Timeline" number="02" className="mb-24 text-center" />
          
          <div className="grid gap-12 md:grid-cols-5 relative">
            <div className="absolute top-[24px] left-0 right-0 h-px bg-white/[0.05] hidden md:block" />
            {[
              { title: "Discovery", desc: "Brief audit & moodboards" },
              { title: "Research", desc: "Analytics & structural wireframes" },
              { title: "Design", desc: "Custom light/dark style details" },
              { title: "Development", desc: "React, Tailwind, motion logic" },
              { title: "Launch", desc: "Lighthouse optimization check" },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4 md:flex-col md:items-center relative z-10 md:text-center w-full">
                <div className="h-12 w-12 rounded-full border border-white/[0.08] bg-card flex items-center justify-center font-bold text-xs text-white">
                  {idx + 1}
                </div>
                <div className="mt-1 md:mt-4">
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed mt-1">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="px-6 py-32 sm:px-8 lg:px-12 bg-transparent border-t border-white/[0.04]">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Got Questions?" title="Frequently Asked" number="03" className="mb-20 text-center" />

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-[6px] border border-white/[0.08] bg-card overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-6 text-left outline-none cursor-none"
                    type="button"
                  >
                    <span className="text-sm font-medium text-white">{item.question}</span>
                    <span className="text-white/60 shrink-0 ml-4 transition-transform duration-300">
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

      {/* Booking CTA */}
      <section className="px-6 py-36 sm:px-8 lg:px-12 bg-transparent text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-wide text-white mb-6">
            Ready to kick off your project?
          </h2>
          <p className="text-white/60 text-sm mb-10 max-w-md mx-auto leading-relaxed">
            Book a discovery call to discuss styling metrics, project timelines, and custom requirements.
          </p>
          <LuxuryButton
            href="https://calendly.com"
          >
            Book a Discovery Call
          </LuxuryButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
