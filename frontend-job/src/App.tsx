import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { HomePage } from "@/pages/Home/HomePage";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CustomCursor } from "@/components/layout/CustomCursor";

// Lazy-loaded pages
const WorkPage = React.lazy(() => import("@/pages/Work/WorkPage").then(m => ({ default: m.WorkPage })));
const CaseStudyPage = React.lazy(() => import("@/pages/CaseStudy/CaseStudyPage").then(m => ({ default: m.CaseStudyPage })));
const ServicesPage = React.lazy(() => import("@/pages/Services/ServicesPage").then(m => ({ default: m.ServicesPage })));
const AboutPage = React.lazy(() => import("@/pages/About/AboutPage").then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import("@/pages/Contact/ContactPage").then(m => ({ default: m.ContactPage })));
const WritingPage = React.lazy(() => import("@/pages/Writing/WritingPage").then(m => ({ default: m.WritingPage })));
const ArticlePage = React.lazy(() => import("@/pages/Writing/ArticlePage").then(m => ({ default: m.ArticlePage })));
const NotFound = React.lazy(() => import("@/pages/NotFound/NotFoundPage"));

// Studio Admin imports
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext";
const StudioLayout = React.lazy(() => import("@/components/studio/StudioLayout").then(m => ({ default: m.StudioLayout })));
const Login = React.lazy(() => import("@/pages/Studio/Login").then(m => ({ default: m.Login })));
const DashboardOverview = React.lazy(() => import("@/pages/Studio/DashboardOverview").then(m => ({ default: m.DashboardOverview })));
const CaseStudiesManager = React.lazy(() => import("@/pages/Studio/CaseStudiesManager").then(m => ({ default: m.CaseStudiesManager })));
const CaseStudyEdit = React.lazy(() => import("@/pages/Studio/CaseStudyEdit").then(m => ({ default: m.CaseStudyEdit })));
const LeadTracker = React.lazy(() => import("@/pages/Studio/LeadTracker").then(m => ({ default: m.LeadTracker })));
const ContentManager = React.lazy(() => import("@/pages/Studio/ContentManager").then(m => ({ default: m.ContentManager })));
const SEOManager = React.lazy(() => import("@/pages/Studio/SEOManager").then(m => ({ default: m.SEOManager })));
const MediaLibrary = React.lazy(() => import("@/pages/Studio/MediaLibrary").then(m => ({ default: m.MediaLibrary })));
const Settings = React.lazy(() => import("@/pages/Studio/Settings").then(m => ({ default: m.Settings })));
const SiteSettings = React.lazy(() => import("@/pages/Studio/SiteSettings").then(m => ({ default: m.SiteSettings })));
const WritingManager = React.lazy(() => import("@/pages/Studio/WritingManager").then(m => ({ default: m.WritingManager })));
const WritingEdit = React.lazy(() => import("@/pages/Studio/WritingEdit").then(m => ({ default: m.WritingEdit })));

const queryClient = new QueryClient();

function AppRouter() {
  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/experience" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/writing/:slug" element={<ArticlePage />} />
          
          {/* Admin Route Aliases */}
          <Route path="/admin/login" element={<Navigate to="/studio/login" replace />} />
          <Route path="/admin" element={<Navigate to="/studio" replace />} />
          <Route path="/admin/dashboard" element={<Navigate to="/studio" replace />} />
          <Route path="/admin/*" element={<Navigate to="/studio" replace />} />

          {/* Studio Admin Routes */}
          <Route path="/studio/login" element={<Login />} />
          <Route path="/studio" element={
            <ProtectedRoute>
              <StudioLayout>
                <DashboardOverview />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/projects" element={
            <ProtectedRoute>
              <StudioLayout>
                <CaseStudiesManager />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/projects/:id" element={
            <ProtectedRoute>
              <StudioLayout>
                <CaseStudyEdit />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/writing" element={
            <ProtectedRoute>
              <StudioLayout>
                <WritingManager />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/writing/:id" element={
            <ProtectedRoute>
              <StudioLayout>
                <WritingEdit />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/leads" element={
            <ProtectedRoute>
              <StudioLayout>
                <LeadTracker />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/content" element={
            <ProtectedRoute>
              <StudioLayout>
                <ContentManager />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/seo" element={
            <ProtectedRoute>
              <StudioLayout>
                <SEOManager />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/media" element={
            <ProtectedRoute>
              <StudioLayout>
                <MediaLibrary />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/site-settings" element={
            <ProtectedRoute>
              <StudioLayout>
                <SiteSettings />
              </StudioLayout>
            </ProtectedRoute>
          } />
          <Route path="/studio/settings" element={
            <ProtectedRoute>
              <StudioLayout>
                <Settings />
              </StudioLayout>
            </ProtectedRoute>
          } />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
