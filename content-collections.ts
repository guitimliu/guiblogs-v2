import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import rehypeShiki from "@shikijs/rehype";
import GithubSlugger from "github-slugger";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";

export type TocEntry = {
  id: string;
  text: string;
  depth: number;
};

function extractToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^(```|~~~)/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = match[2]
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .trim();
    toc.push({ id: slugger.slug(text), text, depth: match[1].length });
  }
  return toc;
}

function excerptFromMarkdown(markdown: string, maxLength = 110): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`([^`]*)`/g, "$1") // inline code -> keep its text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
    .replace(/^\s{0,3}>\s?/gm, "") // blockquote
    .replace(/^\s*[-*+]\s+/gm, "") // unordered list
    .replace(/^\s*\d+\.\s+/gm, "") // ordered list
    .replace(/[*_~]/g, "") // emphasis marks
    .replace(/<[^>]+>/g, " ") // html tags
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();

  if (text.length <= maxLength) return text;

  const slice = text.slice(0, maxLength);
  // Prefer to end on a full stop in the back half; otherwise hard-cut + ellipsis.
  const sentenceEnd = Math.max(
    slice.lastIndexOf("。"),
    slice.lastIndexOf("！"),
    slice.lastIndexOf("？"),
  );
  if (sentenceEnd >= maxLength * 0.5) return slice.slice(0, sentenceEnd + 1);
  return `${slice.replace(/[，、,.\s]+$/, "")}…`;
}

function readingTimeMinutes(markdown: string): number {
  const cjkChars = (markdown.match(/[一-鿿぀-ヿ]/g) ?? []).length;
  const latinWords = (
    markdown.replace(/[一-鿿぀-ヿ]/g, " ").match(/\b\w+\b/g) ?? []
  ).length;
  return Math.max(1, Math.round(cjkChars / 300 + latinWords / 200));
}

const markdownOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [
      rehypeShiki,
      {
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      },
    ],
  ],
  // The plugin tuples above are valid unified plugin entries; the markdown
  // adapter's types only accept bare plugins, hence the cast.
} as unknown as Parameters<typeof compileMarkdown>[2];

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.md",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    description: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, markdownOptions);
    const { content, ...rest } = document;
    return {
      ...rest,
      date: document.date.toISOString(),
      updated: document.updated?.toISOString(),
      slug: document._meta.path,
      html,
      excerpt: excerptFromMarkdown(content),
      toc: extractToc(content),
      readingTimeMinutes: readingTimeMinutes(content),
    };
  },
});

const pages = defineCollection({
  name: "pages",
  directory: "content/pages",
  include: "**/*.md",
  schema: z.object({
    content: z.string(),
    title: z.string(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, markdownOptions);
    const { content: _content, ...rest } = document;
    return {
      ...rest,
      slug: document._meta.path,
      html,
    };
  },
});

export default defineConfig({
  content: [posts, pages],
});
