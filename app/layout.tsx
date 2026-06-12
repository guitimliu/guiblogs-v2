import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { site } from "@/lib/site";

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
      className={`${notoSerif.variable} ${lora.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-body">
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
