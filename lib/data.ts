import profileJson from "@/content/data/profile.json";
import worksJson from "@/content/data/works.json";

export type ProfileLink = {
  label: string;
  url: string;
};

export type Profile = {
  name: string;
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
