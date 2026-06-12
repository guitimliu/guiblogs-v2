---
title: Tailwind v4 的 CSS-first 主題設定
date: 2026-03-15 14:00:00 +08:00
tags: [CSS, Tailwind]
categories: [開發]
description: 告別 tailwind.config.js，v4 用 @theme 在 CSS 裡定義 design tokens。
---

Tailwind v4 最大的改變是不再需要 `tailwind.config.js`。

## @theme 語法

Design tokens 直接寫在 CSS：

```css
@import "tailwindcss";

@theme {
  --color-paper: #faf6f0;
  --color-ink: #2b2620;
  --font-serif: "Noto Serif TC", serif;
}
```

定義完 `--color-paper` 之後，`bg-paper`、`text-paper` 這些 utility 就自動生效。

## 跟 dark mode 搭配

搭配 CSS variables 做雙主題很乾淨：

```css
:root {
  --bg: var(--color-paper);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1c1814;
  }
}
```

## 心得

從 v3 的 JS config 搬過來大概半小時，値得。
