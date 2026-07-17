import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// This blog wants to be cited by AI answer engines, so we explicitly welcome
// both retrieval bots (fetch live to answer + cite) and training bots.
const aiRetrievalBots = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
];

const aiTrainingBots = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiRetrievalBots, allow: "/" },
      { userAgent: aiTrainingBots, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
