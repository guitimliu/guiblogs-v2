import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// TEMP: site is not yet ready for public indexing. Restore to
// `{ userAgent: "*", allow: "/" }` plus sitemap reference when ready.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
