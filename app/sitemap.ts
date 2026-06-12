import type { MetadataRoute } from "next";
import {
  getAllCategories,
  getAllTags,
  getPublishedPosts,
  getTotalPages,
} from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();

  return [
    { url: `${site.url}/`, lastModified: new Date(posts[0]?.date ?? Date.now()) },
    ...posts.map((post) => ({
      url: `${site.url}/posts/${encodeURIComponent(post.slug)}/`,
      lastModified: new Date(post.updated ?? post.date),
    })),
    ...Array.from({ length: getTotalPages() - 1 }, (_, i) => ({
      url: `${site.url}/page/${i + 2}/`,
    })),
    { url: `${site.url}/archives/` },
    { url: `${site.url}/tags/` },
    ...getAllTags().map(({ name }) => ({
      url: `${site.url}/tags/${encodeURIComponent(name)}/`,
    })),
    { url: `${site.url}/categories/` },
    ...getAllCategories().map(({ name }) => ({
      url: `${site.url}/categories/${encodeURIComponent(name)}/`,
    })),
    { url: `${site.url}/about/` },
  ];
}
