import { Hero } from "@/components/home/hero";
import { WorksGrid } from "@/components/home/works-grid";
import { RecentPosts } from "@/components/home/recent-posts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorksGrid />
      <RecentPosts />
    </>
  );
}
