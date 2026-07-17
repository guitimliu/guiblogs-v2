import {
  getAllCategories,
  getPublishedPosts,
} from "@/lib/posts";
import { postDescription, postUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// llms.txt — a machine-readable map of the site for AI models at inference time.
// Regenerated at build time (like feed.xml/sitemap) so it never drifts.
export function GET() {
  const lines: string[] = [
    `# ${site.title}`,
    "",
    "> 台北前端工程師 Gui 的程式筆記與個人成長紀錄，主題涵蓋 CSS、JavaScript、Vue、Bootstrap、Hexo 架站與後端工具（PHP / MySQL / Git）。",
    "",
    "## 關於作者",
    `- [關於我](${site.url}/about/)：職涯、技能與社群連結`,
    "",
    "## 全部文章",
  ];

  for (const post of getPublishedPosts()) {
    const desc = postDescription(post);
    lines.push(`- [${post.title}](${postUrl(post)})${desc ? `: ${desc}` : ""}`);
  }

  lines.push("", "## 依分類瀏覽");
  for (const { name, count } of getAllCategories()) {
    lines.push(
      `- [${name}（${count}）](${site.url}/categories/${encodeURIComponent(name)}/)`,
    );
  }

  lines.push(
    "",
    "## 其他資源",
    `- [完整站台地圖](${site.url}/sitemap.xml)`,
    `- [RSS Feed](${site.url}/feed.xml)`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
