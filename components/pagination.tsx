import Link from "next/link";

export function Pagination({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  if (total <= 1) return null;

  const prevHref = current === 2 ? "/" : `/page/${current - 1}/`;
  const nextHref = `/page/${current + 1}/`;

  return (
    <nav className="flex items-center justify-between py-8 text-sm">
      {current > 1 ? (
        <Link href={prevHref} className="text-muted hover:text-accent">
          ← 較新文章
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted">
        {current} / {total}
      </span>
      {current < total ? (
        <Link href={nextHref} className="text-muted hover:text-accent">
          較舊文章 →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
