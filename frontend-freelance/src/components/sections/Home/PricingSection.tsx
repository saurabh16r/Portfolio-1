import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { LuxuryButton } from "@/components/common/LuxuryButton";
import { Magnetic } from "@/components/common/Magnetic";
import { api } from "@/services/api.js";

const defaultPricingPlans = [
  {
    name: "Landing Page",
    price: "₹8,000",
    subtitle: "Starting at",
    description: "High-converting, motion-first Framer landing pages engineered to captivate visitors and drive actions.",
    features: [
      "1-2 Custom Framer / React Pages",
      "Motion-first Interactive Micro-animations",
      "Mobile & Tablet Responsive Design",
      "SEO Metadata & OpenGraph Setup",
      "Fast 1-2 Week Turnaround",
      "14 Days Post-Launch Support"
    ],
    popular: false,
    ctaText: "Start Landing Page"
  },
  {
    name: "Business Website",
    price: "₹18,000",
    subtitle: "Starting at",
    description: "Multi-page bespoke web presence built for startups, digital agencies, and ambitious brands.",
    features: [
      "Up to 5 Custom Unique Pages",
      "Modular Content System Integration",
      "WebGL & 3D Interactive Canvas Effects",
      "Full SEO & Performance Optimization",
      "Contact Form & Lead Routing Setup",
      "30 Days Post-Launch Support"
    ],
    popular: true,
    ctaText: "Start Business Website"
  },
  {
    name: "Agency Whitelabel",
    price: "Custom",
    subtitle: "Retainer / Per Project",
    description: "Reliable, high-speed design and Framer/React engineering partner for growing agencies.",
    features: [
      "Dedicated Whitelabel Engineering",
      "Custom Component Design Systems",
      "Priority Rapid Delivery Pipeline",
      "Direct Slack / Async Communication",
      "Unlimited Code & Copy Revisions",
      "Flexible Project or Monthly Retainer"
    ],
    popular: false,
    ctaText: "Discuss Partnership"
  }
];

export function PricingSection() {
  const [plans, setPlans] = useState<any[]>(defaultPricingPlans);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("/content");
        if (res && res.pricing && res.pricing.list && res.pricing.list.length > 0) {
          setPlans(res.pricing.list);
        }
      } catch (err) {
        console.log("Using default pricing packages");
      }
    };
    fetchContent();
  }, []);

  return (
    <section id="pricing" className="px-6 pt-0 pb-[160px] sm:px-8 lg:px-12 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionHeading eyebrow="Investment" title="Project Pricing" number="04" />
          <p className="mt-4 md:mt-0 text-xs text-white/50 max-w-xs font-sans">
            Transparent pricing packages tailored for high-growth startups and established brands.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className={`relative rounded-[16px] border p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? "border-accent/40 bg-[#0E0E0E] shadow-[0_0_30px_rgba(201,169,106,0.08)]"
                  : "border-white/[0.08] bg-[#0B0B0B] hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[9px] uppercase tracking-widest text-accent font-bold">
                  <Sparkles size={11} /> Popular Choice
                </div>
              )}

              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold block mb-2">
                  Package 0{idx + 1}
                </span>
                <h3 className="font-display font-medium text-2xl uppercase tracking-wider text-white">
                  {plan.name}
                </h3>

                <div className="mt-6 flex items-baseline gap-2 pb-6 border-b border-white/[0.06]">
                  <span className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white font-medium">
                    {plan.price}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                    {plan.subtitle}
                  </span>
                </div>

                <p className="mt-6 text-xs text-white/60 leading-relaxed font-sans min-h-[48px]">
                  {plan.description}
                </p>

                {/* Features list */}
                <div className="mt-8 space-y-3.5">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-4">
                    What's Included
                  </span>
                  {plan.features?.map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/30 text-accent">
                        <Check size={10} />
                      </div>
                      <span className="text-xs text-white/80 font-sans">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action CTA */}
              <div className="mt-10 pt-6 border-t border-white/[0.06]">
                <Magnetic range={45} strength={0.25}>
                  <div className="w-full">
                    <LuxuryButton
                      to="/contact"
                      className={`w-full justify-center ${
                        plan.popular
                          ? ""
                          : "border-white/10 bg-white/[0.02] hover:border-white/30 text-white/80 hover:text-white"
                      }`}
                    >
                      {plan.ctaText || "Select Package"}
                    </LuxuryButton>
                  </div>
                </Magnetic>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
