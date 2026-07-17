import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/posts";
import { postDescription } from "@/lib/seo";

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const aosDelay = Math.min(index * 60, 300);
  const description = postDescription(post);
  return (
    <article className="py-8" data-aos="fade-up" data-aos-delay={aosDelay}>
      <p className="font-mono text-xs tracking-wide text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="mx-2 text-line">/</span>
        {post.readingTimeMinutes} min
      </p>
      <h2 className="mt-2 text-xl font-bold leading-relaxed">
        <Link
          href={`/${post.slug}/`}
          className="transition-colors hover:text-accent"
        >
          {post.title}
        </Link>
      </h2>
      {description && (
        <p className="mt-2 leading-loose text-soft">{description}</p>
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
