#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const title = process.argv[2];
if (!title) {
  console.error('用法: pnpm new "文章標題"');
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = join(root, "content", "posts");

function localIso(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

const now = new Date();
const asciiSlug = title
  .toLowerCase()
  .replace(/[^a-z0-9一-鿿]+/g, "-")
  .replace(/^-+|-+$/g, "");
const slug =
  asciiSlug ||
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-post`;

const filePath = join(postsDir, `${slug}.md`);
if (existsSync(filePath)) {
  console.error(`已存在，不覆寫: ${filePath}`);
  process.exit(1);
}

const frontmatter = `---
title: ${title}
date: ${localIso(now)}
tags: []
categories: []
description: ""
draft: false
---

`;

mkdirSync(postsDir, { recursive: true });
writeFileSync(filePath, frontmatter);
console.log(`已建立: ${filePath}`);
