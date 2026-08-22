import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { HomeHero } from "@/components/sections/Home/HomeHero";
import { QuoteSection } from "@/components/common/QuoteSection";
import { CinematicBackground } from "@/components/layout/CinematicBackground";

// Lazy-loaded sub-sections to boost LCP/FCP bundle performance
const FeaturedWork = React.lazy(() =>
  import("@/components/sections/Home/FeaturedWork").then((mod) => ({ default: mod.FeaturedWork }))
);
const TestimonialsSection = React.lazy(() =>
  import("@/components/sections/Home/TestimonialsSection").then((mod) => ({ default: mod.TestimonialsSection }))
);
const HomeServices = React.lazy(() =>
  import("@/components/sections/Home/HomeServices").then((mod) => ({ default: mod.HomeServices }))
);
const AboutSection = React.lazy(() =>
  import("@/components/sections/Home/AboutSection").then((mod) => ({ default: mod.AboutSection }))
);
const ContactSection = React.lazy(() =>
  import("@/components/sections/Home/ContactSection").then((mod) => ({ default: mod.ContactSection }))
);

export function HomePage() {
  // Editorial entrance transition preset for main sections
  const sectionReveal = {
    initial: { opacity: 0, y: 45, filter: "blur(4px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <Helmet>
        <title>Saurabh Rathore — Premium Framer & UI Designer</title>
        <meta name="description" content="Clean, motion-first digital design and high-end Webflow & Framer development." />
        <meta property="og:title" content="Saurabh Rathore — UI/UX Designer & Framer Developer" />
        <meta property="og:description" content="Clean, motion-first digital design and high-end Webflow & Framer development." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://saurabh-rathore.com" />
      </Helmet>

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
        {/* Featured Work section transition */}
        <motion.div {...sectionReveal}>
          <FeaturedWork />
        </motion.div>

        {/* Testimonials section transition */}
        <motion.div {...sectionReveal}>
          <TestimonialsSection />
        </motion.div>

        {/* Services section transition */}
        <motion.div {...sectionReveal}>
          <HomeServices />
        </motion.div>

        <QuoteSection
          number="02"
          label="PROCESS"
          quote="Every pixel should have a purpose."
          accentWord="purpose"
          author="SAURABH RATHORE"
          variant="offset"
        />

        {/* About section transition */}
        <motion.div {...sectionReveal}>
          <AboutSection />
        </motion.div>

        <QuoteSection
          number="03"
          label="PRINCIPLE"
          quote="Great products are built through thoughtful design, not decoration."
          accentWord="thoughtful"
          author="SAURABH RATHORE"
          variant="minimal"
        />

        {/* Contact section transition */}
        <motion.div {...sectionReveal}>
          <ContactSection />
        </motion.div>
      </React.Suspense>

      <Footer />
    </div>
  );
}
