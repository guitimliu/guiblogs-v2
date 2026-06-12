import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPostsPage, getTotalPages } from "@/lib/posts";

export default function HomePage() {
  return (
    <>
      <div className="divide-y divide-line">
        {getPostsPage(1).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination current={1} total={getTotalPages()} />
    </>
  );
}
