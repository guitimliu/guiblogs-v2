import profileJson from "@/content/data/profile.json";
import worksJson from "@/content/data/works.json";
import teachingJson from "@/content/data/teaching.json";

export type ProfileLink = {
  label: string;
  url: string;
};

export type Profile = {
  name: string;
  tagline: string;
  bio: string[];
  location: string;
  avatar: string;
  links: ProfileLink[];
};

export type Work = {
  title: string;
  image: string;
  role: string;
  url: string;
  featured: boolean;
};

export function getProfile(): Profile {
  return profileJson as Profile;
}

export function getWorks(): Work[] {
  return worksJson as Work[];
}

export function getFeaturedWorks(): Work[] {
  return getWorks().filter((w) => w.featured);
}

export type TeachingItem = {
  type: "課程" | "講座" | "工作坊";
  title: string;
  role: string;
  format: string;
  period: string;
  status: string;
  url: string;
};

export function getTeaching(): TeachingItem[] {
  return teachingJson as TeachingItem[];
}
