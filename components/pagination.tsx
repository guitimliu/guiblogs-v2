import Link from "next/link";

function pageHref(page: number, basePath: string): string {
  return page === 1 ? `${basePath}/` : `${basePath}/page/${page}/`;
}

// Build a windowed list of page numbers around `current`, always including
// page 1 and `total`, with "ellipsis" markers for gaps.
//   1 2 3 ... 14         (current near start)
//   1 ... 6 7 8 ... 14   (current in middle)
//   1 ... 12 13 14       (current near end)
function getPageItems(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  let start = Math.max(1, current - 1);
  let end = Math.min(total, current + 1);
  if (start === 1) end = Math.min(total, 3);
  if (end === total) start = Math.max(1, total - 2);

  const items: (number | "ellipsis")[] = [];
  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("ellipsis");
  }
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total) {
    if (end < total - 1) items.push("ellipsis");
    items.push(total);
  }
  return items;
}

const cellBase =
  "flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm transition-colors";

export function Pagination({
  current,
  total,
  basePath,
}: {
  current: number;
  total: number;
  basePath: string;
}) {
  if (total <= 1) return null;

  const items = getPageItems(current, total);
  const prev = current > 1 ? current - 1 : null;
  const next = current < total ? current + 1 : null;

  return (
    <nav
      aria-label="分頁"
      className="flex items-center justify-center gap-1 py-10 font-mono"
    >
      {prev !== null && (
        <Link
          href={pageHref(prev, basePath)}
          aria-label="上一頁"
          className={`${cellBase} text-muted hover:bg-surface hover:text-accent`}
        >
          <Chevron direction="left" />
        </Link>
      )}

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span
            key={`e-${i}`}
            aria-hidden
            className={`${cellBase} text-muted`}
          >
            …
          </span>
        ) : item === current ? (
          <span
            key={item}
            aria-current="page"
            className={`${cellBase} bg-surface font-bold text-ink`}
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(item, basePath)}
            className={`${cellBase} text-muted hover:bg-surface hover:text-accent`}
          >
            {item}
          </Link>
        ),
      )}

      {next !== null && (
        <Link
          href={pageHref(next, basePath)}
          aria-label="下一頁"
          className={`${cellBase} text-muted hover:bg-surface hover:text-accent`}
        >
          <Chevron direction="right" />
        </Link>
      )}
    </nav>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}
