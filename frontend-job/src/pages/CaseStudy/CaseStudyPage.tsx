import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { projects } from "@/data/projects";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CaseStudyHero } from "@/components/sections/CaseStudy/CaseStudyHero";
import { CaseStudyOverview } from "@/components/sections/CaseStudy/CaseStudyOverview";
import { ResearchInsights } from "@/components/sections/CaseStudy/ResearchInsights";
import { ProcessTimeline } from "@/components/sections/CaseStudy/ProcessTimeline";
import { DesignSystemDetails } from "@/components/sections/CaseStudy/DesignSystemDetails";
import { CaseStudyShowcase } from "@/components/sections/CaseStudy/CaseStudyShowcase";
import { CinematicBackground } from "@/components/layout/CinematicBackground";
import { LuxuryButton } from "@/components/common/LuxuryButton";
import { api, getImageUrl } from "@/services/api.js";

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();

  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const fallbackProject = projects[projectIndex];
  
  const [rawProject, setRawProject] = useState<any>(fallbackProject);

  useEffect(() => {
    const fetchLiveProject = async () => {
      if (!slug) return;
      try {
        const live = await api.get(`/case-studies/${slug}`);
        if (live) {
          setRawProject(live);
        }
      } catch (err) {
        console.log("Could not load live case study details, using static fallback.");
      }
    };
    fetchLiveProject();
  }, [slug]);

  const processProjectData = (proj: any) => {
    if (!proj) return null;
    
    const processed = {
      ...proj,
      // Default array values to avoid mapping undefined properties
      overview: proj.overview || [],
      problem: proj.problem || [],
      goals: proj.goals || [],
      research: proj.research || [],
      technologies: proj.technologies || [],
      challenge: proj.challenge || [],
      solution: proj.solution || [],
      results: proj.results || [],
      accent: proj.accent || "from-white/20 to-slate-800/70",
      heroImage: proj.heroImage || proj.image || "",
    };

    // If dynamic MongoDB blocks exist, extract content to flat structures
    if (proj.blocks && proj.blocks.length > 0) {
      proj.blocks.forEach((block: any) => {
        if (!block || !block.type || !block.data) return;
        
        switch (block.type) {
          case "Hero":
            processed.title = block.data.title || proj.title;
            processed.intro = block.data.description || proj.description;
            break;
          case "Overview":
            processed.overview = block.data.points || [];
            break;
          case "Problem":
            processed.problem = block.data.points || [];
            break;
          case "Goals":
            processed.goals = block.data.points || [];
            break;
          case "Challenges":
            processed.challenge = block.data.points || [];
            break;
          case "Results":
            processed.results = block.data.points || [];
            break;
          case "Research":
            processed.research = block.data.cards || [];
            break;
          case "User Persona":
            processed.userPersona = {
              name: block.data.name || "",
              role: block.data.role || "",
              quote: block.data.quote || "",
              needs: block.data.needs || [],
              painPoints: block.data.painPoints || []
            };
            break;
          case "Design System":
            processed.designSystem = {
              colors: block.data.colors || [],
              typography: block.data.typography || ["Inter"],
              buttons: block.data.buttons || [],
              components: block.data.components || [],
              spacing: block.data.spacing || "8px / 16px / 24px"
            };
            break;
          case "Gallery":
            processed.galleryImages = block.data.images || [];
            break;
          default:
            break;
        }
      });
    }
    
    return processed;
  };

  const project = processProjectData(rawProject);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-white font-sans">
        <CinematicBackground />
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/40 font-bold">Not Found</p>
          <h1 className="mt-4 text-2xl sm:text-3xl font-display font-medium tracking-wide">This case study does not exist.</h1>
          <Link to="/work" className="mt-6 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-none">
            <ArrowLeft size={16} /> Back to work archive
          </Link>
        </div>
      </div>
    );
  }

  const prevProject = projects[projectIndex - 1] || projects[projects.length - 1];
  const nextProject = projects[projectIndex + 1] || projects[0];

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden font-sans">
      <Helmet>
        <title>{`${project.title} Case Study — Saurabh Rathore`}</title>
        <meta name="description" content={project.description} />
        <link rel="canonical" href={`https://saurabh-rathore.com/work/${project.slug}`} />
      </Helmet>

      <SmoothScroll />
      <CinematicBackground />
      <Navbar />

      <CaseStudyHero project={project} />

      {/* Large Hero Image Banner */}
      {project.heroImage && (
        <section className="px-6 sm:px-8 lg:px-12 bg-transparent">
          <div className="mx-auto max-w-7xl">
            <div
              className={`h-[40vh] md:h-[60vh] w-full rounded-[2rem] bg-gradient-to-br ${project.accent} overflow-hidden relative border border-white/[0.08]`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                style={{ backgroundImage: `url(${getImageUrl(project.heroImage, 1600)})` }}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        </section>
      )}

      <CaseStudyOverview project={project} />
      <ResearchInsights project={project} />
      <ProcessTimeline />
      <DesignSystemDetails project={project} />
      <CaseStudyShowcase project={project} />

      {/* Previous / Next Project Navigation Links */}
      <section className="px-6 py-20 sm:px-8 lg:px-12 bg-transparent border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            to={`/work/${prevProject.slug}`}
            className="flex flex-col items-start gap-1 group text-left cursor-none"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 flex items-center gap-1">
              <ArrowLeft size={10} /> Previous
            </span>
            <span className="text-white font-semibold group-hover:text-white/60 transition-colors">
              {prevProject.title}
            </span>
          </Link>

          <Link
            to={`/work/${nextProject.slug}`}
            className="flex flex-col items-end gap-1 group text-right cursor-none"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 flex items-center gap-1">
              Next <ArrowLeft className="rotate-180" size={10} />
            </span>
            <span className="text-white font-semibold group-hover:text-white/60 transition-colors">
              {nextProject.title}
            </span>
          </Link>
        </div>
      </section>

      {/* Case Study Bottom CTA */}
      <section className="px-6 py-32 sm:px-8 lg:px-12 bg-transparent border-t border-white/[0.04] text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-wide text-white mb-6">
            Interested in working together?
          </h2>
          <p className="text-white/60 text-sm mb-10 max-w-md mx-auto leading-relaxed">
            Let's team up to build high-end UI/UX designs, animations, and clean React or Framer systems.
          </p>
          <LuxuryButton to="/contact">
            Contact Me
          </LuxuryButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
