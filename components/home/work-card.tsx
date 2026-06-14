import Image from "next/image";
import type { Work } from "@/lib/data";

export function WorkCard({ work }: { work: Work }) {
  const hasUrl = work.url.length > 0;
  const content = (
    <>
      <div className="aspect-[16/10] overflow-hidden rounded-lg border border-line bg-surface">
        <Image
          src={work.image}
          alt={work.title}
          width={640}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
          {work.title}
        </h3>
        {hasUrl && (
          <span
            aria-hidden
            className="font-mono text-xs text-muted transition-colors group-hover:text-accent"
          >
            ↗
          </span>
        )}
      </div>
      <p className="mt-1 font-mono text-xs tracking-wide text-muted">
        {work.role}
      </p>
    </>
  );

  if (hasUrl) {
    return (
      <a
        href={work.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {content}
      </a>
    );
  }

  return <div className="group block">{content}</div>;
}
