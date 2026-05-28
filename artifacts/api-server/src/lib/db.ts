import Database from "@replit/database";

const client = new Database();

export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  visible: boolean;
  thumbnail_gradient: string;
  thumbnail_url: string;
  role: string;
  timeline: string;
  tools: string[];
  type: string;
  overview: { challenge: string; my_role: string[] };
  research: { number: string; heading: string; description: string }[];
  solution_features: { title: string; description: string; image_url: string }[];
  results: { number: string; label: string }[];
  learnings: { worked: string[]; improve: string[] };
  order: number;
};

export type Service = {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  visible: boolean;
};

export type Profile = {
  tagline: string;
  bio: string;
  photo_url: string;
  skills: string[];
  email: string;
  phone: string;
  linkedin: string;
  behance: string;
};

export type SiteSettings = {
  site_title: string;
  meta_description: string;
  admin_password_hash: string;
};

async function get<T>(key: string): Promise<T | null> {
  const raw = await (client as any).get(key);
  if (raw === null || raw === undefined) return null;
  // @replit/database v3 wraps responses: { ok: true, value: ... }
  const val = (raw && typeof raw === "object" && "value" in raw) ? (raw as { value: unknown }).value : raw;
  if (val === null || val === undefined) return null;
  if (typeof val === "string") {
    try { return JSON.parse(val) as T; } catch { return val as unknown as T; }
  }
  return val as T;
}

async function set(key: string, value: unknown): Promise<void> {
  await (client as any).set(key, value);
}

export async function getProjects(): Promise<Project[]> {
  return (await get<Project[]>("projects")) ?? [];
}

export async function setProjects(projects: Project[]): Promise<void> {
  await set("projects", projects);
}

export async function getServices(): Promise<Service[]> {
  return (await get<Service[]>("services")) ?? [];
}

export async function setServices(services: Service[]): Promise<void> {
  await set("services", services);
}

export async function getProfile(): Promise<Profile> {
  return (await get<Profile>("profile")) ?? defaultProfile();
}

export async function setProfile(profile: Profile): Promise<void> {
  await set("profile", profile);
}

export async function getSettings(): Promise<SiteSettings> {
  return (await get<SiteSettings>("settings")) ?? defaultSettings();
}

export async function setSettings(s: SiteSettings): Promise<void> {
  await set("settings", s);
}

function defaultProfile(): Profile {
  return {
    tagline: "Framer Designer & Developer",
    bio: "I craft premium digital experiences — from pixel-perfect UI design to production-ready Framer builds. Based in India, working globally.",
    photo_url: "",
    skills: ["Figma", "Framer", "UI Design", "UX Research", "Prototyping", "Brand Design"],
    email: "saurabh@example.com",
    phone: "",
    linkedin: "https://www.linkedin.com/in/saurabh-singh-rathore-04a982332/",
    behance: "https://www.behance.net/ankitrathore29",
  };
}

function defaultSettings(): SiteSettings {
  return {
    site_title: "Saurabh Rathore — Framer Designer & Developer",
    meta_description: "Portfolio of Saurabh Rathore — UI/UX Designer and Framer Developer crafting premium digital experiences.",
    admin_password_hash: "",
  };
}
