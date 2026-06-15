import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { decodeParam } from "@/lib/slug";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ name }) => ({ tag: name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return { title: `標籤：${decodeParam(tag)}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const name = decodeParam(tag);
  const posts = getPostsByTag(name);
  if (posts.length === 0) notFound();

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold" data-aos="fade-up">
        #{name}
      </h1>
      <div className="mt-4 divide-y divide-line">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
