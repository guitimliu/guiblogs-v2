import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Toc } from "@/components/toc";
import { formatDate } from "@/lib/format";
import { getAdjacentPosts, getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { decodeParam } from "@/lib/slug";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(decodeParam(slug));
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeParam(rawSlug);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <article className="py-10">
      <header className="mb-10">
        <h1 className="text-[1.75rem] font-bold leading-relaxed tracking-wide">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-xs tracking-wide text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="mx-2 text-line">/</span>
          {post.readingTimeMinutes} min
          {post.categories.length > 0 && (
            <>
              {" · "}
              {post.categories.map((category, i) => (
                <span key={category}>
                  {i > 0 && "、"}
                  <Link
                    href={`/categories/${category}/`}
                    className="hover:text-accent"
                  >
                    {category}
                  </Link>
                </span>
              ))}
            </>
          )}
        </p>
      </header>

      <Toc entries={post.toc} />

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {post.tags.length > 0 && (
        <p className="mt-10 flex flex-wrap gap-x-3 gap-y-1 text-sm">
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

      <nav className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm sm:flex-row sm:justify-between">
        {prev ? (
          <Link href={`/posts/${prev.slug}/`} className="text-muted hover:text-accent">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/posts/${next.slug}/`}
            className="text-muted hover:text-accent sm:text-right"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
