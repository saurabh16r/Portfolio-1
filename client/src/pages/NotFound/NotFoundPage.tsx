import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-white">
      <Helmet>
        <title>Page Not Found (404) — Saurabh Rathore</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      <div>
        <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[#666] mb-4">Error Code</p>
        <h1 className="font-display font-medium text-[clamp(6rem,15vw,10rem)] uppercase leading-none tracking-tight text-accent">
          404
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Page Not Found</h2>
        <p className="mt-4 max-w-sm text-sm text-[#8b8b8b] leading-relaxed mx-auto">
          The link you followed may be broken, or the page has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white hover:border-accent/40 hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
