import Link from "next/link";
import type { Crumb } from "@/lib/schema";

/**
 * Renders ancestor breadcrumb links. The current page itself is the adjacent
 * <h1>, so it isn't repeated here — pass only the ancestor crumbs. Uses the
 * same Crumb[] (absolute URLs) as breadcrumbSchema() so markup and structured
 * data stay in sync.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="麵包屑"
      className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted"
    >
      {items.map((item, i) => (
        <span key={item.url} className="flex items-center gap-x-2">
          {i > 0 && <span className="text-line">/</span>}
          <Link href={item.url} className="hover:text-accent">
            {item.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}
