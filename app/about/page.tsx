import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPages } from "content-collections";

export const metadata: Metadata = { title: "關於我" };

export default function AboutPage() {
  const page = allPages.find((p) => p.slug === "about");
  if (!page) notFound();

  return (
    <article className="py-10">
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <div
        className="prose mt-8"
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </article>
  );
}
