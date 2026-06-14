import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPostsPage, getTotalPages } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Blog" };

export default function BlogIndexPage() {
  return (
    <>
      <div className="divide-y divide-line">
        {getPostsPage(1).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination current={1} total={getTotalPages()} basePath={site.blogBasePath} />
    </>
  );
}
