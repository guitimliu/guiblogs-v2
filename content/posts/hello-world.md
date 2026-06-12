---
title: Hello World — 部落格重生
date: 2026-06-01 10:00:00 +08:00
tags: [部落格]
categories: [生活]
description: 從 Hexo 搬到自己用 Next.js 打造的靜態部落格，新家落成。
---

寫了很多年的 Hexo 部落格，終於決定搬家了。

## 為什麼重寫

Hexo 陪我走過了很長一段時間，但主題客製化每次都要跟 EJS 模板搏鬥。
這次乾脆用現代前端工具自己打造一個：

- **Next.js 16** — App Router + 純靜態輸出
- **Tailwind CSS v4** — CSS-first 設定
- **content-collections** — 型別安全的 Markdown 管線

## 寫作流程不變

寫作體驗刻意保持跟 Hexo 一樣：

```bash
pnpm new "文章標題"   # 開新文章
pnpm dev             # 即時預覽
pnpm generate        # 輸出靜態檔
```

一樣是 Markdown + frontmatter，只是引擎全換了。

## 接下來

舊文章會慢慢搬過來，新家請多指教。
