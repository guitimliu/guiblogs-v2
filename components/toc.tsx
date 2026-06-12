"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/content-collections";

export function Toc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0% 0% -70% 0%" },
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="目錄"
      className="mb-10 rounded-md border border-line bg-surface px-5 py-4"
    >
      <p className="mb-2 font-mono text-xs tracking-widest text-muted">目錄</p>
      <ul className="space-y-1 text-sm">
        {entries.map((entry) => (
          <li key={entry.id} className={entry.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${entry.id}`}
              className={
                activeId === entry.id
                  ? "text-accent"
                  : "text-muted transition-colors hover:text-accent"
              }
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
