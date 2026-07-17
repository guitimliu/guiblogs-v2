import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getAllTags } from "@/lib/posts";
import {
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
  jsonLdGraph,
} from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "標籤",
  alternates: { canonical: "/tags/" },
};

const parentCrumbs: Crumb[] = [{ name: "首頁", url: `${site.url}/` }];
const schemaCrumbs: Crumb[] = [
  ...parentCrumbs,
  { name: "標籤", url: `${site.url}/tags/` },
];

export default function TagsPage() {
  return (
    <div className="py-10">
      <JsonLd
        data={jsonLdGraph(
          collectionPageSchema({ name: "標籤", url: `${site.url}/tags/` }),
          breadcrumbSchema(schemaCrumbs),
        )}
      />
      <Breadcrumbs items={parentCrumbs} />
      <h1 className="text-2xl font-bold" data-aos="fade-up">
        標籤
      </h1>
      <ul
        className="mt-6 flex flex-wrap gap-x-5 gap-y-3"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {getAllTags().map(({ name, count }) => (
          <li key={name}>
            <Link
              href={`/tags/${name}/`}
              className="transition-colors hover:text-accent"
            >
              #{name} <span className="text-sm text-muted">({count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
