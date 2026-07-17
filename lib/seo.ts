import type { Post } from "@/lib/posts";
import { site } from "@/lib/site";

/** Static fallback OG image (1200×630) for pages without a cover. */
export const OG_DEFAULT_IMAGE = `${site.url}/og-default.png`;

/** Build an absolute site URL from a root-relative path. */
export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Canonical URL of a post (matches sitemap/feed: trailing slash, encoded slug). */
export function postUrl(post: { slug: string }): string {
  return `${site.url}/${encodeURIComponent(post.slug)}/`;
}

/** Upgrade a URL to an absolute https URL (http→https, relative→absolute). */
export function toAbsoluteHttps(url: string): string {
  let u = url.trim();
  if (u.startsWith("//")) u = `https:${u}`;
  else if (u.startsWith("http://")) u = `https://${u.slice("http://".length)}`;
  else if (!/^https?:\/\//.test(u)) u = absoluteUrl(u);
  return u;
}

/**
 * Normalize a cover value for use as an OG/schema image: absolute https,
 * falling back to the default OG image when there's no cover.
 */
export function normalizeCover(cover?: string): string {
  const c = cover?.trim();
  return c ? toAbsoluteHttps(c) : OG_DEFAULT_IMAGE;
}

/** Post description: frontmatter `description` first, else the derived excerpt. */
export function postDescription(post: Post): string | undefined {
  return post.description ?? post.excerpt;
}
