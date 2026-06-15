import Image from "next/image";
import type { Work } from "@/lib/data";

export function WorkCard({ work, index = 0 }: { work: Work; index?: number }) {
  const hasUrl = work.url.length > 0;
  const aosDelay = Math.min(index * 80, 320);
  const content = (
    <>
      <div className="aspect-[16/9] overflow-hidden rounded-lg border border-line bg-surface">
        {work.video ? (
          <video
            src={work.video}
            poster={work.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={work.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={work.image}
            alt={work.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
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
        data-aos="fade-up"
        data-aos-delay={aosDelay}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group block" data-aos="fade-up" data-aos-delay={aosDelay}>
      {content}
    </div>
  );
}
