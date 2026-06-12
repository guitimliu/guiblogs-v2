import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { site } from "@/lib/site";

// Runs before paint to set data-theme from localStorage or system preference,
// avoiding a flash of wrong theme on first load.
const themeBootScript = `
(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=(s==='light'||s==='dark')?s:(d?'dark':'light');}catch(e){document.documentElement.dataset.theme='light';}})();
`;

const notoSerif = Noto_Serif_TC({
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  preload: false,
});

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.title}`,
  },
  description: site.description,
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: site.title }],
    },
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
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
