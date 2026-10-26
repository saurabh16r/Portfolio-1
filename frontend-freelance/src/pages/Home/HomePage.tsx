import React from "react";
import { SEOHead } from "@/components/common/SEOHead";
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
  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <SEOHead
        title="Saurabh Rathore — Freelance Web Design & UI/UX Development"
        description="High-converting websites, Framer development, and motion-first UI/UX for startups and ambitious brands."
        canonicalUrl="https://saurabh-rathore.com"
      />

      {/* Unified singleton smooth scrolling and ambient depth system */}
      <SmoothScroll />
      <CinematicBackground />

      {/* Global Navigation with Realtime Cinematic Scroll Progress */}
      <Navbar />

      {/* Act I: Hero Experience */}
      <HomeHero />
      
      {/* Chapter Transition 01: Philosophy */}
      <QuoteSection
        number="01"
        label="PHILOSOPHY"
        quote="Good design is not how it looks — it's how it feels."
        accentWord="looks"
        author="SAURABH RATHORE"
        variant="left"
      />
      
      <React.Suspense fallback={<div className="min-h-[400px]" />}>
        {/* Act II: Selected Works with Staggered Depth */}
        <FeaturedWork />

        {/* Chapter Transition 02: Process */}
        <QuoteSection
          number="02"
          label="PROCESS"
          quote="Every pixel should have a purpose."
          accentWord="purpose"
          author="SAURABH RATHORE"
          variant="offset"
        />

        {/* Act III: Services & Capabilities */}
        <HomeServices />

        {/* Act IV: Investment & Pricing Packages */}
        <PricingSection />

        {/* Chapter Transition 03: Principle */}
        <QuoteSection
          number="03"
          label="PRINCIPLE"
          quote="Great products are built through thoughtful design, not decoration."
          accentWord="thoughtful"
          author="SAURABH RATHORE"
          variant="minimal"
        />

        {/* Act V: Client Testimonials Marquee Flow */}
        <TestimonialsSection />

        {/* Act VI: Dialogue & Project Initiation */}
        <ContactSection />
      </React.Suspense>

      <Footer />
    </div>
  );
}
