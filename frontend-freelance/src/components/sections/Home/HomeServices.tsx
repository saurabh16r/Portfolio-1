import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/components/common/ServiceCard";

export function HomeServices() {
  return (
    <section className="px-6 pt-0 pb-[160px] sm:px-8 lg:px-12 bg-transparent border-y border-white/[0.04]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionHeading eyebrow="Expertise" title="Services Preview" number="03" />
          <Link
            to="/services"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white border-b border-white/20 pb-1 hover:border-white transition-all"
          >
            View Services <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((srv, idx) => (
            <ServiceCard
              key={srv.title}
              number={`0${idx + 1}`}
              icon={srv.icon}
              title={srv.title}
              desc={srv.description}
              price={srv.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
