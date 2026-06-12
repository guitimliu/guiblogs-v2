---
title: Next.js 16 靜態輸出踩坑筆記
date: 2026-05-20 22:30:00 +08:00
tags: [Next.js, React]
categories: [開發]
description: output export 模式下 generateStaticParams、async params 與 Cloudflare Pages 的幾個地雷。
---

把 Next.js 16 當純靜態產生器用，有幾個地方跟文件想像中不一樣。

## async params

Next.js 16 開始 `params` 是 Promise，所有 dynamic route 都要先 await：

```tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // ...
}
```

忘記 await 的話 TypeScript 會抓到，但錯誤訊息不太直觀。

## generateStaticParams 是必填

`output: 'export'` 模式下，每個 dynamic route 都必須提供：

```tsx
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}
```

## 部署到 Cloudflare Pages

純靜態的話不需要任何 adapter，build 出 `out/` 直接上：

```bash
pnpm build
npx wrangler pages deploy out
```

### trailingSlash

記得開 `trailingSlash: true`，輸出會變成 `posts/foo/index.html`，
跟靜態主機的資料夾式 serving 完全對齊。
