import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPostsPage, getTotalPages } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: getTotalPages() - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return { title: `Blog — 第 ${page} 頁` };
}

export default async function BlogPagePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const current = Number(page);
  return (
    <>
      <div className="divide-y divide-line">
        {getPostsPage(current).map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
      <Pagination current={current} total={getTotalPages()} basePath={site.blogBasePath} />
    </>
  );
}
