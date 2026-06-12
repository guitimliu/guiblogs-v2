import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="py-8">
      <p className="font-mono text-xs tracking-wide text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="mx-2 text-line">/</span>
        {post.readingTimeMinutes} min
      </p>
      <h2 className="mt-2 text-xl font-semibold leading-relaxed">
        <Link
          href={`/posts/${post.slug}/`}
          className="transition-colors hover:text-accent"
        >
          {post.title}
        </Link>
      </h2>
      {post.description && (
        <p className="mt-2 leading-loose text-soft">{post.description}</p>
      )}
      {post.tags.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}/`}
              className="text-muted transition-colors hover:text-accent"
            >
              #{tag}
            </Link>
          ))}
        </p>
      )}
    </article>
  );
}
