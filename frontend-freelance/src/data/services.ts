import { Monitor, Layers3, Handshake, type LucideIcon } from "lucide-react";

export type Service = {
  title: string;
  description: string;
  price: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: "Landing Pages",
    description:
      "High-converting, fast-loading Framer pages that make visitors stay and take action.",
    price: "Starting at ₹8,000",
    icon: Monitor,
  },
  {
    title: "Business Websites",
    description:
      "Multi-page Framer websites for studios, brands, and ambitious businesses that need presence and performance.",
    price: "Starting at ₹18,000",
    icon: Layers3,
  },
  {
    title: "Agency Whitelabel",
    description:
      "Reliable Framer builds for agencies that want a high-quality behind-the-scenes partner.",
    price: "Let's talk pricing",
    icon: Handshake,
  },
];
