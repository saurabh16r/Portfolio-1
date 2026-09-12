import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { LuxuryButton } from "@/components/common/LuxuryButton";
import { api } from "../../services/api.js";

type JobContactFormData = {
  name: string;
  email: string;
  company?: string;
  opportunityType: string;
  details: string;
};

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobContactFormData>();

  const onSubmit = async (data: JobContactFormData) => {
    try {
      await api.post("/leads", {
        name: data.name,
        email: data.email,
        company: data.company || "",
        budget: "N/A - Job Enquiry",
        timeline: "N/A - Job Enquiry",
        message: `Opportunity Type: ${data.opportunityType}\n\n${data.details}`,
        projectType: data.opportunityType,
        type: "job",
        sourcePage: "Job Contact Page"
      });

      setSubmitted(true);
      reset();
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      alert("Inquiry submission failed. Please try again.");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formContainerRef.current) return;
    const rect = formContainerRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const inputReveal = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div
      ref={formContainerRef}
      onMouseMove={handleMouseMove}
      className="group relative rounded-[16px] border border-white/[0.08] bg-[#0E0E0E] p-5 sm:p-8 md:p-10 w-full max-w-[720px] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.035), transparent 85%)`,
        }}
      />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="job-contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 flex flex-col gap-8 w-full"
          >
            {/* Row 1: Name and Email */}
            <motion.div {...inputReveal} className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-3 block text-xs font-semibold text-white/50 tracking-wide">
                  Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Your full name"
                  className="w-full h-[56px] px-5 rounded-[16px] border border-white/[0.08] bg-[#050505] text-xs text-white placeholder-white/20 outline-none transition-all duration-300 hover:border-white/20 focus:border-accent focus:shadow-[0_0_15px_rgba(201,169,106,0.15)] cursor-none"
                />
                {errors.name && (
                  <span className="text-[10px] text-red-400 mt-1.5 block">{errors.name.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="mb-3 block text-xs font-semibold text-white/50 tracking-wide">
                  Work Email <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Work email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="name@company.com"
                  className="w-full h-[56px] px-5 rounded-[16px] border border-white/[0.08] bg-[#050505] text-xs text-white placeholder-white/20 outline-none transition-all duration-300 hover:border-white/20 focus:border-accent focus:shadow-[0_0_15px_rgba(201,169,106,0.15)] cursor-none"
                />
                {errors.email && (
                  <span className="text-[10px] text-red-400 mt-1.5 block">{errors.email.message}</span>
                )}
              </div>
            </motion.div>

            {/* Row 2: Organization and Opportunity Type */}
            <motion.div {...inputReveal} className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-3 block text-xs font-semibold text-white/50 tracking-wide">
                  Company / Organization
                </label>
                <input
                  type="text"
                  {...register("company")}
                  placeholder="e.g. Acme Corp / Meta"
                  className="w-full h-[56px] px-5 rounded-[16px] border border-white/[0.08] bg-[#050505] text-xs text-white placeholder-white/20 outline-none transition-all duration-300 hover:border-white/20 focus:border-accent focus:shadow-[0_0_15px_rgba(201,169,106,0.15)] cursor-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-3 block text-xs font-semibold text-white/50 tracking-wide">
                  Opportunity Type <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("opportunityType", { required: true })}
                    className="w-full h-[56px] px-5 pr-10 rounded-[16px] border border-white/[0.08] bg-[#050505] text-xs text-white outline-none transition-all duration-300 hover:border-white/20 focus:border-accent focus:shadow-[0_0_15px_rgba(201,169,106,0.15)] cursor-none appearance-none"
                  >
                    <option value="Full-Time Engineering / Design">Full-Time (Design or Engineering)</option>
                    <option value="Contract / Senior Advisory">Contract / Fractional Role</option>
                    <option value="Design System Consulting">Design System Architecture</option>
                    <option value="General Hiring Inquiry">General Hiring Inquiry</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 1L5 5L9 1" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Row 3: Role & Opportunity Details */}
            <motion.div {...inputReveal} className="flex flex-col">
              <label className="mb-3 block text-xs font-semibold text-white/50 tracking-wide">
                Role & Opportunity Details <span className="text-accent">*</span>
              </label>
              <textarea
                {...register("details", { required: "Please provide details regarding the opportunity" })}
                placeholder="Tell me about the role, team, vision, or project opportunity..."
                className="w-full min-h-[180px] px-5 py-5 rounded-[16px] border border-white/[0.08] bg-[#050505] text-xs text-white placeholder-white/20 outline-none transition-all duration-300 hover:border-white/20 focus:border-accent focus:shadow-[0_0_15px_rgba(201,169,106,0.15)] cursor-none resize-none leading-relaxed"
              />
              {errors.details && (
                <span className="text-[10px] text-red-400 mt-1.5 block">{errors.details.message}</span>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div {...inputReveal} className="pt-2 flex justify-start">
              <LuxuryButton type="submit" showArrow={true} className="w-auto px-10">
                Send Message
              </LuxuryButton>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 space-y-6 relative z-10"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white">
              <CheckCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Message Received!</h3>
              <p className="text-[#8b8b8b] text-xs mt-3 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. I'll review your opportunity details and respond promptly.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-1.5 text-xs text-white border-b border-white/20 pb-0.5 hover:border-white transition-colors cursor-none bg-transparent"
            >
              Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
