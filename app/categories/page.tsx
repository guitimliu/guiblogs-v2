import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getAllCategories } from "@/lib/posts";
import {
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
  jsonLdGraph,
} from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "分類",
  alternates: { canonical: "/categories/" },
};

const parentCrumbs: Crumb[] = [{ name: "首頁", url: `${site.url}/` }];
const schemaCrumbs: Crumb[] = [
  ...parentCrumbs,
  { name: "分類", url: `${site.url}/categories/` },
];

export default function CategoriesPage() {
  return (
    <div className="py-10">
      <JsonLd
        data={jsonLdGraph(
          collectionPageSchema({ name: "分類", url: `${site.url}/categories/` }),
          breadcrumbSchema(schemaCrumbs),
        )}
      />
      <Breadcrumbs items={parentCrumbs} />
      <h1 className="text-2xl font-bold" data-aos="fade-up">
        分類
      </h1>
      <ul
        className="mt-6 space-y-3"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {getAllCategories().map(({ name, count }) => (
          <li key={name}>
            <Link
              href={`/categories/${name}/`}
              className="transition-colors hover:text-accent"
            >
              {name} <span className="text-sm text-muted">({count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
