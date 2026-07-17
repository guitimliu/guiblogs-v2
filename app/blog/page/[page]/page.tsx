import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { getPostsPage, getTotalPages } from "@/lib/posts";
import {
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
  jsonLdGraph,
} from "@/lib/schema";
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
  return {
    title: `Blog — 第 ${page} 頁`,
    alternates: { canonical: `/blog/page/${page}/` },
  };
}

export default async function BlogPagePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const current = Number(page);
  const pageUrl = `${site.url}/blog/page/${current}/`;
  const parentCrumbs: Crumb[] = [
    { name: "首頁", url: `${site.url}/` },
    { name: "Blog", url: `${site.url}/blog/` },
  ];
  const schemaCrumbs: Crumb[] = [
    ...parentCrumbs,
    { name: `第 ${current} 頁`, url: pageUrl },
  ];
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          collectionPageSchema({ name: `Blog — 第 ${current} 頁`, url: pageUrl }),
          breadcrumbSchema(schemaCrumbs),
        )}
      />
      <Breadcrumbs items={parentCrumbs} />
      <div className="divide-y divide-line">
        {getPostsPage(current).map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
      <Pagination current={current} total={getTotalPages()} basePath={site.blogBasePath} />
    </>
  );
}
