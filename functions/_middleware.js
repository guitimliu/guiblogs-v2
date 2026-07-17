// Cloudflare Pages Function：在邊緣做 Accept: text/markdown 的內容協商。
// 部落格是 Next.js `output: "export"` 純靜態輸出，Cloudflare Free 方案也沒有
// 原生「Markdown for Agents」，所以用這個 middleware 手動轉發到 build time
// 產生的 markdown 分身檔（見 scripts/generate-markdown-twins.mjs）。
export async function onRequest({ request, next, env }) {
  const accept = request.headers.get("Accept") ?? "";
  if (!accept.includes("text/markdown")) return next();

  const url = new URL(request.url);
  const mdPath = url.pathname.endsWith("/")
    ? `${url.pathname}index.md`
    : `${url.pathname}/index.md`;

  const asset = await env.ASSETS.fetch(new URL(mdPath, url.origin));
  if (asset.status !== 200) return next();

  return new Response(asset.body, {
    status: 200,
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
