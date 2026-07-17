import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";
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
  return getAllCategories().map(({ name }) => ({ category: name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = decodeParam(category);
  return {
    title: `分類：${name}`,
    alternates: { canonical: `/categories/${encodeURIComponent(name)}/` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = decodeParam(category);
  const posts = getPostsByCategory(name);
  if (posts.length === 0) notFound();

  const url = `${site.url}/categories/${encodeURIComponent(name)}/`;
  const parentCrumbs: Crumb[] = [
    { name: "首頁", url: `${site.url}/` },
    { name: "分類", url: `${site.url}/categories/` },
  ];
  const schemaCrumbs: Crumb[] = [...parentCrumbs, { name, url }];

  return (
    <div className="py-10">
      <JsonLd
        data={jsonLdGraph(
          collectionPageSchema({ name: `分類：${name}`, url }),
          breadcrumbSchema(schemaCrumbs),
        )}
      />
      <Breadcrumbs items={parentCrumbs} />
      <h1 className="text-2xl font-bold" data-aos="fade-up">
        {name}
      </h1>
      <div className="mt-4 divide-y divide-line">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
