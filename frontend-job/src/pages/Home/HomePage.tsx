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
const AboutSection = React.lazy(() =>
  import("@/components/sections/Home/AboutSection").then((mod) => ({ default: mod.AboutSection }))
);
const SkillsSection = React.lazy(() =>
  import("@/components/sections/Home/SkillsSection").then((mod) => ({ default: mod.SkillsSection }))
);
const ExperienceSection = React.lazy(() =>
  import("@/components/sections/Home/ExperienceSection").then((mod) => ({ default: mod.ExperienceSection }))
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
        title="Saurabh Rathore — UI/UX Designer & Framer Developer"
        description="UI/UX Designer and Framer Developer creating thoughtful, responsive digital experiences with a focus on interface design, interaction and the web."
        canonicalUrl="https://saurabh-rathore.com"
      />

      <SmoothScroll />
      <CinematicBackground />

      <Navbar />
      <HomeHero />
      
      <QuoteSection
        number="01"
        label="PHILOSOPHY"
        quote="Good design is defined by clarity, interaction, and purpose — not decoration."
        accentWord="clarity"
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
          quote="Design shouldn't stop in Figma. Building the interaction reveals how the experience actually feels."
          accentWord="interaction"
          author="SAURABH RATHORE"
          variant="offset"
        />

        {/* About Me */}
        <motion.div {...sectionReveal}>
          <AboutSection />
        </motion.div>

        {/* Skills */}
        <motion.div {...sectionReveal}>
          <SkillsSection />
        </motion.div>

        {/* Experience Timeline */}
        <motion.div {...sectionReveal}>
          <ExperienceSection />
        </motion.div>

        <QuoteSection
          number="03"
          label="PRINCIPLE"
          quote="A thoughtful interface makes digital products understandable; great execution makes them feel effortless."
          accentWord="effortless"
          author="SAURABH RATHORE"
          variant="minimal"
        />

        {/* Job Contact Form & Final CTA */}
        <motion.div {...sectionReveal}>
          <ContactSection />
        </motion.div>
      </React.Suspense>

      <Footer />
    </div>
  );
}
