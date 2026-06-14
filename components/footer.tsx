import Link from "next/link";
import { site } from "@/lib/site";

const utilityNav = [
  { href: "/archives/", label: "歸檔" },
  { href: "/tags/", label: "標籤" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-9 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.author} · {site.subtitle}
        </p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {utilityNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="/feed.xml"
            className="underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            RSS
          </a>
        </nav>
      </div>
    </footer>
  );
}
