#!/usr/bin/env node
// 為 Cloudflare Pages Function（functions/_middleware.js）產生 markdown 分身：
// 讓 Accept: text/markdown 的請求能直接拿到乾淨的 markdown，而不是 HTML。
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = join(root, "content", "posts");
const outDir = join(root, "out");

function splitFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { frontmatter: {}, body: raw };
  return { frontmatter: parseYaml(match[1]) ?? {}, body: match[2] };
}

let count = 0;
for (const filename of readdirSync(postsDir)) {
  if (!filename.endsWith(".md")) continue;
  const slug = filename.slice(0, -".md".length);
  const raw = readFileSync(join(postsDir, filename), "utf8");
  const { frontmatter, body } = splitFrontmatter(raw);
  if (frontmatter.draft) continue;

  const postOutDir = join(outDir, encodeURIComponent(slug));
  mkdirSync(postOutDir, { recursive: true });
  writeFileSync(
    join(postOutDir, "index.md"),
    `# ${frontmatter.title}\n\n${body.trim()}\n`,
  );
  count++;
}

// llms.txt 本身就是合法 markdown（# / ## / - [text](url)），直接拿來當首頁的 markdown 分身。
copyFileSync(join(outDir, "llms.txt"), join(outDir, "index.md"));

console.log(`已產生 ${count} 篇文章 + 1 個首頁的 markdown 分身`);
