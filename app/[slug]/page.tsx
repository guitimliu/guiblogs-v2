import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Comments } from "@/components/comments";
import { JsonLd } from "@/components/json-ld";
import { Toc } from "@/components/toc";
import { getProfile } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getAdjacentPosts, getPostBySlug, getPublishedPosts } from "@/lib/posts";
import {
  blogPostingSchema,
  breadcrumbSchema,
  type Crumb,
  jsonLdGraph,
} from "@/lib/schema";
import {
  normalizeCover,
  postDescription,
  postUrl,
  toAbsoluteHttps,
} from "@/lib/seo";
import { site } from "@/lib/site";
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
  const url = postUrl(post);
  const description = postDescription(post);
  const ogImage = normalizeCover(post.cover);
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      siteName: site.title,
      locale: "zh_TW",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [`${site.url}/about/`],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
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
  const profile = getProfile();
  const primaryCategory = post.categories[0];
  const parentCrumbs: Crumb[] = [
    { name: "首頁", url: `${site.url}/` },
    ...(primaryCategory
      ? [
          {
            name: primaryCategory,
            url: `${site.url}/categories/${encodeURIComponent(primaryCategory)}/`,
          },
        ]
      : []),
  ];
  const schemaCrumbs: Crumb[] = [
    ...parentCrumbs,
    { name: post.title, url: postUrl(post) },
  ];

  return (
    <article className="py-10">
      <JsonLd
        data={jsonLdGraph(
          blogPostingSchema(post),
          breadcrumbSchema(schemaCrumbs),
        )}
      />
      <Breadcrumbs items={parentCrumbs} />
      <header className="mb-10" data-aos="fade-up">
        <h1 className="text-[1.75rem] font-bold leading-relaxed tracking-wide">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-xs tracking-wide text-muted">
          <Link href="/about/" className="hover:text-accent">
            {profile.name}
          </Link>
          <span className="mx-2 text-line">·</span>
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
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={toAbsoluteHttps(post.cover)}
            alt=""
            loading="lazy"
            className="mt-6 aspect-[2/1] w-full rounded-lg border border-line object-cover"
          />
        )}
      </header>

      <Toc entries={post.toc} />

      <div
        className="prose"
        data-aos="fade-up"
        data-aos-delay="100"
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
          <Link href={`/${prev.slug}/`} className="text-muted hover:text-accent">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/${next.slug}/`}
            className="text-muted hover:text-accent sm:text-right"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <Comments
        identifier={`/${slug}/`}
        url={`${site.url}/${slug}/`}
        title={post.title}
      />
    </article>
  );
}
