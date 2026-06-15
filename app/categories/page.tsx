import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/posts";

export const metadata: Metadata = { title: "分類" };

export default function CategoriesPage() {
  return (
    <div className="py-10">
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
