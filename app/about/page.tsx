import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPages } from "content-collections";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import {
  breadcrumbSchema,
  type Crumb,
  jsonLdGraph,
  profilePageSchema,
} from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "關於我",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const page = allPages.find((p) => p.slug === "about");
  if (!page) notFound();

  const parentCrumbs: Crumb[] = [{ name: "首頁", url: `${site.url}/` }];
  const schemaCrumbs: Crumb[] = [
    ...parentCrumbs,
    { name: "關於我", url: `${site.url}/about/` },
  ];

  return (
    <article className="py-10">
      <JsonLd
        data={jsonLdGraph(profilePageSchema(), breadcrumbSchema(schemaCrumbs))}
      />
      <Breadcrumbs items={parentCrumbs} />
      <h1 className="text-2xl font-bold" data-aos="fade-up">
        {page.title}
      </h1>
      <div
        className="prose mt-8"
        data-aos="fade-up"
        data-aos-delay="100"
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </article>
  );
}
