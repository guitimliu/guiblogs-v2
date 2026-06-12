import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";
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
  return { title: `分類：${decodeParam(category)}` };
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

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold">{name}</h1>
      <div className="mt-4 divide-y divide-line">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
