import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { formatMonthDay } from "@/lib/format";
import { getArchives } from "@/lib/posts";
import {
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
  jsonLdGraph,
} from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "歸檔",
  alternates: { canonical: "/archives/" },
};

const parentCrumbs: Crumb[] = [{ name: "首頁", url: `${site.url}/` }];
const schemaCrumbs: Crumb[] = [
  ...parentCrumbs,
  { name: "歸檔", url: `${site.url}/archives/` },
];

export default function ArchivesPage() {
  return (
    <div className="py-10">
      <JsonLd
        data={jsonLdGraph(
          collectionPageSchema({ name: "歸檔", url: `${site.url}/archives/` }),
          breadcrumbSchema(schemaCrumbs),
        )}
      />
      <Breadcrumbs items={parentCrumbs} />
      <h1 className="text-2xl font-bold" data-aos="fade-up">
        歸檔
      </h1>
      {getArchives().map(({ year, posts }, i) => (
        <section
          key={year}
          className="mt-10"
          data-aos="fade-up"
          data-aos-delay={Math.min(i * 80, 240)}
        >
          <h2 className="select-none font-display text-5xl font-bold leading-none text-line">
            {year}
          </h2>
          <ul className="mt-4 space-y-2">
            {posts.map((post) => (
              <li key={post.slug} className="flex gap-4">
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-xs leading-7 text-muted"
                >
                  {formatMonthDay(post.date)}
                </time>
                <Link
                  href={`/${post.slug}/`}
                  className="leading-7 transition-colors hover:text-accent"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
