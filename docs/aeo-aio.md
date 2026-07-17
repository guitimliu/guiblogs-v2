# AEO / AIO 實作與維護說明

本站針對「被 AI 答案引擎（ChatGPT / Perplexity / Google AI Overviews）機讀與引用」做的優化紀錄與維護清單。

## 目標

讓內容能被寫進 AI 生成的答案裡，而不只是排進傳統搜尋。門檻是「可機讀的結構化身分（schema.org）」＋「新鮮度與作者可信度（E-E-A-T）」。

## 檔案地圖

| 關注點 | 檔案 |
|---|---|
| JSON-LD schema 建構（Person/Org/WebSite/BlogPosting/Breadcrumb/ProfilePage/CollectionPage） | `lib/schema.ts` |
| JSON-LD 注入元件（含 XSS 跳脫） | `components/json-ld.tsx` |
| OG/canonical/封面共用工具（`postUrl`、`normalizeCover`、`toAbsoluteHttps`、`postDescription`、`OG_DEFAULT_IMAGE`） | `lib/seo.ts` |
| 自動摘要 `excerpt`（缺 description 時的 fallback） | `content-collections.ts`（`excerptFromMarkdown`） |
| 全站 `@graph` + 全域 OG/Twitter 預設 | `app/layout.tsx` |
| 文章頁 BlogPosting/Breadcrumb + OG/canonical + 封面/作者 | `app/[slug]/page.tsx` |
| 列表/分類/標籤/封存/about 的 CollectionPage/ProfilePage + canonical + 麵包屑 | `app/blog/**`、`app/categories/**`、`app/tags/**`、`app/archives/page.tsx`、`app/about/page.tsx` |
| 麵包屑 UI（與 schema 同源） | `components/breadcrumbs.tsx` |
| AI 爬蟲規則 | `app/robots.ts` |
| llms.txt（AI 版 sitemap，build 產生） | `app/llms.txt/route.ts` |
| 預設 OG 圖 1200×630 | `public/og-default.png` |
| 作者身分來源（`sameAs` 從此的 http(s) links 取） | `content/data/profile.json` |

## 設計要點

- **`@graph` + `@id` 參照**：`Person`/`Organization`/`WebSite` 定義在 `lib/schema.ts`，用固定 `@id`（`${site.url}/#person` 等）；文章的 `BlogPosting.author`/`publisher` 只用 `@id` 指回去，不重複展開。
- **canonical 每頁自設**：⚠️ 不要在 `layout.tsx` 設全站 canonical——會被子頁繼承，害所有未覆蓋頁指向首頁。首頁在 `app/page.tsx` 自設，其餘頁各自設。
- **麵包屑同源**：`Breadcrumbs` 元件與 `breadcrumbSchema()` 吃同一份 `Crumb[]`（絕對 URL），保證可見連結與 schema 一致。

## 新增文章時（讓 AEO 更好）

frontmatter 最少 `title` + `date` 即可運作（description 會自動用內文 `excerpt`）。想更好：

- `description`：手寫 40–60 字直接答案，會覆蓋自動 excerpt（用於 meta/OG/JSON-LD）。
- `cover`：填圖片網址（http 會自動升 https），會渲染在文章頂並作為 OG image。
- `updated`：有實質更新才填，會反映到 `dateModified`（AI 偏好新鮮內容）。
- `categories`：第一個分類會用於麵包屑與 `articleSection`。

## 驗證

```bash
npm run build          # 產出 out/，含 robots.txt / sitemap.xml / feed.xml / llms.txt
```

- JSON-LD：用 [Rich Results Test](https://search.google.com/test/rich-results)、[Schema Validator](https://validator.schema.org/) 驗證文章頁與首頁的 `@graph`。
- canonical：抽查各頁 `<link rel="canonical">` 指向自身（不是首頁）。
- OG：檢查 `og:image` 為可存取的 https 絕對網址（1200×630）。
- robots/llms：確認 `out/robots.txt` 有 AI 爬蟲規則、`out/llms.txt` 連結正確。

## 後續（尚未做，P2）

- **FAQPage schema**：AI Overviews / Perplexity 引用率最高。可在 `content-collections.ts` 加 optional `faq` 欄位，挑教學型支柱文補 2–4 組問答 + UI。
- **支柱文答案先行改寫**：挑 15–20 篇常青文，每段前 40–60 字先給結論、標題改具體可提取句、多用清單/比較表。
- **動態每篇 OG image**：`app/[slug]/opengraph-image.tsx` build 時把標題渲染成 PNG。
- **`profile.json` 補 LinkedIn**：`sameAs` 影響 E-E-A-T 最大，補上 LinkedIn 個人頁網址即可自動納入。
