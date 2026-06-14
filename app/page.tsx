import { Hero } from "@/components/home/hero";
import { WorksGrid } from "@/components/home/works-grid";
import { Teaching } from "@/components/home/teaching";
import { RecentPosts } from "@/components/home/recent-posts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Teaching />
      <WorksGrid />
      <RecentPosts />
    </>
  );
}
