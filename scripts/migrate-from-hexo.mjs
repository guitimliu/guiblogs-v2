#!/usr/bin/env node
// One-off migration: Hexo source/_posts → content-collections content/posts
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const oldRoot = "/Users/gui/Documents/www/guiblogs";
const oldPostsDir = join(oldRoot, "source/_posts");
const newPostsDir = join(root, "content/posts");

// Flatten Hexo's nested form: `- [tag]` (array-of-arrays) → ["tag"]
function flatten(value) {
  if (!Array.isArray(value)) return value == null ? [] : [String(value)];
  return value.flatMap((v) => (Array.isArray(v) ? v : [v])).map(String);
}

function hexoDateToIso(value) {
  if (value instanceof Date) {
    // Hexo's date is local Taipei; YAML parses unzoned as UTC, so we shift back
    // by reading the components the parser stored.
    const taipei = new Date(value.getTime() + value.getTimezoneOffset() * 60000);
    return taipei.toISOString().replace("Z", "+08:00");
  }
  return String(value);
}

// Drop sample placeholder posts created during scaffolding
const placeholders = [
  "hello-world.md",
  "nextjs-16-static-export.md",
  "tailwind-v4-theme.md",
  "taipei-coffee-map.md",
  "vue-to-react.md",
  "hexo-migration-notes.md",
  "draft-redesign-ideas.md",
];
for (const name of placeholders) {
  try {
    rmSync(join(newPostsDir, name));
  } catch {}
}

mkdirSync(newPostsDir, { recursive: true });

const files = readdirSync(oldPostsDir).filter((f) => f.endsWith(".md"));
let migrated = 0;
let skipped = 0;

for (const file of files) {
  const raw = readFileSync(join(oldPostsDir, file), "utf8");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    console.warn(`skip (no frontmatter): ${file}`);
    skipped++;
    continue;
  }

  const fm = parseYaml(match[1]) ?? {};
  let body = match[2];

  // Strip Hexo's "more" excerpt marker
  body = body.replace(/^\s*<!--\s*more\s*-->\s*\n?/m, "");

  // Slug = original filename minus YYYY-MM-DD- prefix (matches Hexo `:title/`
  // permalink, preserving incoming links to /<slug>/)
  const slug = basename(file, ".md").replace(/^\d{4}-\d{2}-\d{2}-/, "");

  const next = {
    title: fm.title,
    date: hexoDateToIso(fm.date),
    tags: flatten(fm.tags),
    categories: flatten(fm.categories),
  };
  if (fm.index_img) next.cover = fm.index_img;
  if (fm.description) next.description = fm.description;
  next.draft = false;

  const newFrontmatter = stringifyYaml(next, { lineWidth: 0 }).trimEnd();
  const out = `---\n${newFrontmatter}\n---\n\n${body.trimStart()}`;

  writeFileSync(join(newPostsDir, `${slug}.md`), out);
  migrated++;
}

console.log(`migrated: ${migrated}, skipped: ${skipped}`);
