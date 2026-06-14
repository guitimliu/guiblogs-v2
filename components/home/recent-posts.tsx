import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function RecentPosts() {
  const posts = getPublishedPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-line py-12 sm:py-16">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl italic">
          Recent Posts<span className="not-italic text-accent">。</span>
        </h2>
        <Link
          href="/blog/"
          className="font-mono text-xs tracking-wide text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          所有文章 →
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-line">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${post.slug}/`}
              className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="min-w-0 flex-1 truncate font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
                {post.title}
              </span>
              <time
                dateTime={post.date}
                className="shrink-0 whitespace-nowrap font-mono text-xs tracking-wide text-muted"
              >
                {formatDate(post.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
