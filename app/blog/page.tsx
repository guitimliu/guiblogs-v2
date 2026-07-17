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

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog/" },
};

const parentCrumbs: Crumb[] = [{ name: "首頁", url: `${site.url}/` }];
const schemaCrumbs: Crumb[] = [
  ...parentCrumbs,
  { name: "Blog", url: `${site.url}/blog/` },
];

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          collectionPageSchema({ name: "Blog", url: `${site.url}/blog/` }),
          breadcrumbSchema(schemaCrumbs),
        )}
      />
      <Breadcrumbs items={parentCrumbs} />
      <div className="divide-y divide-line">
        {getPostsPage(1).map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
      <Pagination current={1} total={getTotalPages()} basePath={site.blogBasePath} />
    </>
  );
}
