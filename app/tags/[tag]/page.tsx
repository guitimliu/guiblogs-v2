import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import {
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
  jsonLdGraph,
} from "@/lib/schema";
import { site } from "@/lib/site";
import { decodeParam } from "@/lib/slug";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ name }) => ({ tag: name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = decodeParam(tag);
  return {
    title: `標籤：${name}`,
    alternates: { canonical: `/tags/${encodeURIComponent(name)}/` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const name = decodeParam(tag);
  const posts = getPostsByTag(name);
  if (posts.length === 0) notFound();

  const url = `${site.url}/tags/${encodeURIComponent(name)}/`;
  const parentCrumbs: Crumb[] = [
    { name: "首頁", url: `${site.url}/` },
    { name: "標籤", url: `${site.url}/tags/` },
  ];
  const schemaCrumbs: Crumb[] = [...parentCrumbs, { name: `#${name}`, url }];

  return (
    <div className="py-10">
      <JsonLd
        data={jsonLdGraph(
          collectionPageSchema({ name: `標籤：${name}`, url }),
          breadcrumbSchema(schemaCrumbs),
        )}
      />
      <Breadcrumbs items={parentCrumbs} />
      <h1 className="text-2xl font-bold" data-aos="fade-up">
        #{name}
      </h1>
      <div className="mt-4 divide-y divide-line">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
