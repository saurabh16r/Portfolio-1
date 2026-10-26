import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/components/common/ServiceCard";
import {
  sectionStaggerContainer,
  headingRevealVariants,
  ctaRevealVariants,
  cardRevealVariants,
} from "@/lib/motionVariants";

export function HomeServices() {
  return (
    <section className="px-6 pt-0 pb-[160px] sm:px-8 lg:px-12 bg-transparent border-y border-white/[0.04] relative">
      {/* Subtle ambient light pool */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-accent/[0.02] blur-[140px] -z-10" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={sectionStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <motion.div variants={headingRevealVariants}>
            <SectionHeading eyebrow="Expertise" title="Services Preview" number="03" />
          </motion.div>

          <motion.div variants={ctaRevealVariants}>
            <Link
              to="/services"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white border-b border-white/20 pb-1 hover:border-white transition-all group"
            >
              <span>View Services</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((srv, idx) => (
            <motion.div
              key={srv.title}
              variants={cardRevealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.75,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ServiceCard
                number={`0${idx + 1}`}
                icon={srv.icon}
                title={srv.title}
                desc={srv.description}
                price={srv.price}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
