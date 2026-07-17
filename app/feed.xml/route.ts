import { Feed } from "feed";
import { getPublishedPosts } from "@/lib/posts";
import { postDescription } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.url,
    link: site.url,
    language: site.locale,
    copyright: `© ${new Date().getFullYear()} ${site.author}`,
    feedLinks: { rss: `${site.url}/feed.xml` },
    author: { name: site.author },
  });

  for (const post of getPublishedPosts().slice(0, 20)) {
    const url = `${site.url}/${encodeURIComponent(post.slug)}/`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: postDescription(post),
      content: post.html,
      date: new Date(post.date),
      category: post.categories.map((name) => ({ name })),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
