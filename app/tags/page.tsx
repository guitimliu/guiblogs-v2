import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = { title: "標籤" };

export default function TagsPage() {
  return (
    <div className="py-10">
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
