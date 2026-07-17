import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/components/aos-init";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import {
  jsonLdGraph,
  organizationSchema,
  personSchema,
  websiteSchema,
} from "@/lib/schema";
import { OG_DEFAULT_IMAGE } from "@/lib/seo";
import { site } from "@/lib/site";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

// Runs before paint to set data-theme from localStorage or system preference,
// avoiding a flash of wrong theme on first load.
const themeBootScript = `
(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=(s==='light'||s==='dark')?s:(d?'dark':'light');}catch(e){document.documentElement.dataset.theme='light';}})();
`;

const notoSerif = Noto_Serif_TC({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.title} - ${site.subtitle}`,
    template: `%s | ${site.title}`,
  },
  description: site.description,
  alternates: {
    // No site-wide canonical here: metadata canonical is inherited by child
    // routes, so a "/" default would make every un-overridden page canonicalize
    // to the homepage. Each page sets its own canonical instead.
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: site.title }],
    },
  },
  openGraph: {
    type: "website",
    siteName: site.title,
    locale: "zh_TW",
    url: site.url,
    title: `${site.title} - ${site.subtitle}`,
    description: site.description,
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.title} - ${site.subtitle}`,
    description: site.description,
    images: [OG_DEFAULT_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${notoSerif.variable} ${lora.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script
          // Must run synchronously before paint to prevent flash of wrong theme;
          // next/script's beforeInteractive defers via the runtime queue.
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
      </head>
      <body className="flex min-h-full flex-col font-body">
        <JsonLd
          data={jsonLdGraph(
            websiteSchema(),
            organizationSchema(),
            personSchema(),
          )}
        />
        <AOSInit />
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5">{children}</main>
        <Footer />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
