import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-5 py-9 font-mono text-xs text-muted">
        <p>
          © {new Date().getFullYear()} {site.author} · {site.subtitle}
        </p>
        <a
          href="/feed.xml"
          className="underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          RSS
        </a>
      </div>
    </footer>
  );
}
