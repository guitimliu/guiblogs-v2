import { getProfile } from "@/lib/data";
import type { Post } from "@/lib/posts";
import { absoluteUrl, normalizeCover, postDescription, postUrl } from "@/lib/seo";
import { site } from "@/lib/site";

// Stable @id anchors so nodes can cross-reference without re-expanding data.
const PERSON_ID = `${site.url}/#person`;
const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** Wrap schema nodes into a single @graph document. */
export function jsonLdGraph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function personSchema() {
  const profile = getProfile();
  const sameAs = profile.links
    .map((link) => link.url)
    .filter((url) => /^https?:\/\//.test(url)); // drop mailto: and the like
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    jobTitle: "Front-End Engineer",
    url: `${site.url}/about/`,
    image: absoluteUrl(profile.avatar),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Taipei",
      addressCountry: "TW",
    },
    worksFor: { "@id": ORG_ID },
    sameAs,
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.title,
    url: site.url,
    logo: absoluteUrl("/logo.svg"),
    founder: { "@id": PERSON_ID },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.title,
    url: site.url,
    description: site.description,
    inLanguage: "zh-TW",
    publisher: { "@id": ORG_ID },
  };
}

export function blogPostingSchema(post: Post) {
  const url = postUrl(post);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: postDescription(post),
    image: normalizeCover(post.cover),
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
    articleSection: post.categories.length ? post.categories : undefined,
    inLanguage: "zh-TW",
    timeRequired: `PT${post.readingTimeMinutes}M`,
  };
}

export function profilePageSchema() {
  return {
    "@type": "ProfilePage",
    "@id": `${site.url}/about/#profilepage`,
    url: `${site.url}/about/`,
    name: "關於我",
    mainEntity: { "@id": PERSON_ID },
    inLanguage: "zh-TW",
  };
}

export function collectionPageSchema(opts: {
  name: string;
  url: string;
  description?: string;
}) {
  return {
    "@type": "CollectionPage",
    "@id": `${opts.url}#collection`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "zh-TW",
  };
}

export type Crumb = { name: string; url: string };

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
