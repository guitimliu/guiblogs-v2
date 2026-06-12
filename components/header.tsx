import Link from "next/link";
import { site } from "@/lib/site";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/archives/", label: "歸檔" },
  { href: "/tags/", label: "標籤" },
  { href: "/categories/", label: "分類" },
  { href: "/about/", label: "關於" },
];

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-2xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 py-7">
        <Link
          href="/"
          className="font-display text-2xl italic tracking-tight transition-colors hover:text-accent"
        >
          {site.title}
          <span className="not-italic text-accent">。</span>
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
