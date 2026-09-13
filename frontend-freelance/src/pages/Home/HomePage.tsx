import React from "react";
import { SEOHead } from "@/components/common/SEOHead";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { HomeHero } from "@/components/sections/Home/HomeHero";
import { QuoteSection } from "@/components/common/QuoteSection";
import { CinematicBackground } from "@/components/layout/CinematicBackground";

const FeaturedWork = React.lazy(() =>
  import("@/components/sections/Home/FeaturedWork").then((mod) => ({ default: mod.FeaturedWork }))
);
const HomeServices = React.lazy(() =>
  import("@/components/sections/Home/HomeServices").then((mod) => ({ default: mod.HomeServices }))
);
const PricingSection = React.lazy(() =>
  import("@/components/sections/Home/PricingSection").then((mod) => ({ default: mod.PricingSection }))
);
const TestimonialsSection = React.lazy(() =>
  import("@/components/sections/Home/TestimonialsSection").then((mod) => ({ default: mod.TestimonialsSection }))
);
const ContactSection = React.lazy(() =>
  import("@/components/sections/Home/ContactSection").then((mod) => ({ default: mod.ContactSection }))
);

export function HomePage() {
  const sectionReveal = {
    initial: { opacity: 0, y: 45, filter: "blur(4px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <SEOHead
        title="Saurabh Rathore — Freelance Web Design & UI/UX Development"
        description="High-converting websites, Framer development, and motion-first UI/UX for startups and ambitious brands."
        canonicalUrl="https://saurabh-rathore.com"
      />

      <SmoothScroll />
      <CinematicBackground />

      <Navbar />
      <HomeHero />
      
      <QuoteSection
        number="01"
        label="PHILOSOPHY"
        quote="Good design is not how it looks — it's how it feels."
        accentWord="looks"
        author="SAURABH RATHORE"
        variant="left"
      />
      
      <React.Suspense fallback={null}>
        {/* Works / Case Studies */}
        <motion.div {...sectionReveal}>
          <FeaturedWork />
        </motion.div>

        <QuoteSection
          number="02"
          label="PROCESS"
          quote="Every pixel should have a purpose."
          accentWord="purpose"
          author="SAURABH RATHORE"
          variant="offset"
        />

        {/* Services */}
        <motion.div {...sectionReveal}>
          <HomeServices />
        </motion.div>

        {/* Pricing */}
        <motion.div {...sectionReveal}>
          <PricingSection />
        </motion.div>

        <QuoteSection
          number="03"
          label="PRINCIPLE"
          quote="Great products are built through thoughtful design, not decoration."
          accentWord="thoughtful"
          author="SAURABH RATHORE"
          variant="minimal"
        />

        {/* Client Testimonials */}
        <motion.div {...sectionReveal}>
          <TestimonialsSection />
        </motion.div>

        {/* Client / Project Contact Form & Final CTA */}
        <motion.div {...sectionReveal}>
          <ContactSection />
        </motion.div>
      </React.Suspense>

      <Footer />
    </div>
  );
}
