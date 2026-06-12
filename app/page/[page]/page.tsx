import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPostsPage, getTotalPages } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: getTotalPages() - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export default async function PostListPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const current = Number(page);
  return (
    <>
      <div className="divide-y divide-line">
        {getPostsPage(current).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination current={current} total={getTotalPages()} />
    </>
  );
}
