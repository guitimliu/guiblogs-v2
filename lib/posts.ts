import { allPosts, type Post } from "content-collections";
import { site } from "@/lib/site";

export type { Post };

export function getPublishedPosts(): Post[] {
  return allPosts
    .filter((post) => process.env.NODE_ENV !== "production" || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string): {
  prev: Post | undefined;
  next: Post | undefined;
} {
  const posts = getPublishedPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  return {
    // posts are sorted newest-first: prev = newer, next = older
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function getArchives(): { year: string; posts: Post[] }[] {
  const byYear = new Map<string, Post[]>();
  for (const post of getPublishedPosts()) {
    const year = post.date.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), post]);
  }
  return [...byYear.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, posts]) => ({ year, posts }));
}

export type Taxonomy = { name: string; count: number };

function collectTaxonomy(pick: (post: Post) => string[]): Taxonomy[] {
  const counts = new Map<string, number>();
  for (const post of getPublishedPosts()) {
    for (const name of pick(post)) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, count }));
}

export function getAllTags(): Taxonomy[] {
  return collectTaxonomy((post) => post.tags);
}

export function getAllCategories(): Taxonomy[] {
  return collectTaxonomy((post) => post.categories);
}

export function getPostsByTag(tag: string): Post[] {
  return getPublishedPosts().filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string): Post[] {
  return getPublishedPosts().filter((post) => post.categories.includes(category));
}

export function getTotalPages(): number {
  return Math.max(1, Math.ceil(getPublishedPosts().length / site.postsPerPage));
}

export function getPostsPage(page: number): Post[] {
  const start = (page - 1) * site.postsPerPage;
  return getPublishedPosts().slice(start, start + site.postsPerPage);
}
