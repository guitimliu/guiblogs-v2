---
title: 一行 canonical 讓整站都指向首頁：Next.js metadata 繼承的陷阱
date: 2026-07-12 10:30:00
tags:
  - Next.js
  - SEO
  - App Router
categories:
  - Next.js
  - 學習
draft: true
---

> 這是一篇 TIL 草稿，記錄我在做部落格 AEO（讓內容能被 AI 搜尋引擎引用）時，自己埋下又挖出來的一個雷。

## 遇到什麼問題

我在幫部落格補結構化資料與 SEO metadata，想說順手把 canonical 也補上。於是在根 layout 的 `metadata` 裡加了一行「全站預設」：

```ts
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  alternates: {
    canonical: "/", // ← 想說先給個預設，之後各頁再覆蓋
  },
};
```

當下覺得很合理：首頁 canonical 指向 `/`，其他頁之後再各自設定就好。

結果我用 curl 逐頁把 `<link rel="canonical">` 抓出來看，整個傻眼：

```
/                → https://.../          ✅
/blog/           → https://.../          ❌ 應該是 /blog/
/categories/CSS/ → https://.../          ❌ 應該是 /categories/CSS/
/about/          → https://.../          ❌
/archives/       → https://.../          ❌
```

除了首頁跟「有自己設定 canonical 的文章頁」以外，**所有還沒覆蓋的頁面，canonical 全部指向首頁**。這比我一開始「完全沒有 canonical」還糟——等於主動跟搜尋引擎說「這些頁的正版都是首頁」，它們可能因此被去索引。

## 為什麼會這樣

關鍵在 Next.js App Router 的 **metadata 是會繼承與合併的**：page 的 metadata 會疊在 layout 的 metadata 上，page 沒有設定的欄位，就沿用 layout 的。

這套機制對大多數欄位都很方便——像 `title.template`、`openGraph` 的 `siteName`、`locale` 這種「整站共用」的東西，設在 layout 一次就好。

但 `alternates.canonical` 的語意是「**這一頁**的正規網址」，它天生就該每頁不同。把它設在 layout，等於宣告「每一個沒有自己覆蓋的頁，正規網址都是 `/`」。繼承機制照著規則忠實執行，於是一行預設值就污染了整站。

可以類比 CSS：在 `body` 設一個 `color`，所有沒有自己顏色的元素都會繼承它。`color` 適合繼承；但 canonical 比較像「每個元素自己的 `id`」——本來就不該從父層繼承一個共用值下來。我錯把一個「該逐頁唯一」的屬性，當成「整站共用」的屬性設定了。

而且這個 bug 特別陰險：canonical 是 `<head>` 裡看不見的標籤，畫面完全正常，肉眼、點擊都不會發現。要嘛用工具逐頁抓 `<head>`，要嘛等搜尋排名掉了才驚覺。

## 怎麼解

方向很單純：**canonical 不要設在 layout，改成每頁自己設**。

首頁的 canonical 就在首頁自己設：

```ts
// app/page.tsx
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
```

其他頁面各自設定自己的（靜態頁直接寫、動態頁在 `generateMetadata` 裡組）：

```ts
// app/categories/[category]/page.tsx
export async function generateMetadata({ params }) {
  const name = decodeParam((await params).category);
  return {
    title: `分類：${name}`,
    alternates: { canonical: `/categories/${encodeURIComponent(name)}/` },
  };
}
```

這樣沒補到的頁面，頂多是「沒有 canonical」（中性、無害），也不會再錯誤地全部指向首頁。

**取捨**：另一個做法是保留 layout 的預設值、但確保「每一頁」都覆蓋。但這很容易漏——只要有一頁忘了設，就繼承到錯的預設。與其靠紀律去補齊每一頁，不如讓「沒設定」的預設狀態是安全的（無 canonical），這叫 fail-safe：出錯時往安全的方向倒。

順便學到的排查習慣：這種看不見的 `<head>` 標籤，值得寫個小迴圈固定抽查——

```bash
for p in / /blog/ /categories/CSS/ /about/; do
  curl -s "localhost:3000$p" | grep -o 'rel="canonical" href="[^"]*"'
done
```

## 小結

會被繼承的東西，就不要拿來放「該每個個體唯一」的值——canonical 屬於頁面自己，設在 layout 只會讓一行預設值污染整站。看不見的標籤，要用工具逼它現形。
