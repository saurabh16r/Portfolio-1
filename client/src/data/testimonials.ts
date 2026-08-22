export type Testimonial = {
  name: string;
  position: string;
  company: string;
  rating: number;
  text: string;
  project?: string;
  photo?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "John Smith",
    position: "Founder",
    company: "StartupX",
    rating: 5,
    text: "Saurabh delivered exactly what we envisioned. The attention to detail and motion quality exceeded our expectations.",
    project: "StartupX Landing Page",
  },
  {
    name: "Sarah Jenkins",
    position: "Product Lead",
    company: "FinTech Flow",
    rating: 5,
    text: "His rare ability to bridge visual luxury with high-performance React code transformed our platform's user experience.",
    project: "FinTech Flow Redesign",
  },
  {
    name: "Marcus Aurelius",
    position: "Creative Director",
    company: "Nexus Studio",
    rating: 5,
    text: "Clean structures, exceptionally smooth Framer components, and a refined minimalist design eye. Highly recommended.",
    project: "Nexus Agency Website",
  },
];
