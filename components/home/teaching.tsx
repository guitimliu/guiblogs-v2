import { getTeaching } from "@/lib/data";

export function Teaching() {
  const items = getTeaching();
  if (items.length === 0) return null;

  return (
    <section
      className="border-t border-line py-12 sm:py-16"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl italic">
          Teaching &amp; Talks<span className="not-italic text-accent">。</span>
        </h2>
        <p className="font-mono text-xs tracking-wide text-muted">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>
      <ul className="mt-6 divide-y divide-line">
        {items.map((item) => (
          <li key={item.title}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 py-6 sm:gap-5"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-wide text-accent">
                  {item.type}
                </span>
                <h3 className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-accent sm:text-2xl">
                  {item.title}
                </h3>
                <p className="flex flex-wrap items-baseline gap-2 text-base">
                  <span className="font-mono text-xs uppercase tracking-wide text-muted">
                    擔任
                  </span>
                  <span className="font-bold text-accent">{item.role}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-x-6 gap-y-2 font-mono text-xs tracking-wide text-muted">
                <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <div className="flex items-baseline gap-2">
                    <dt className="text-[0.65rem] uppercase">Format</dt>
                    <dd className="text-soft">{item.format}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="text-[0.65rem] uppercase">Period</dt>
                    <dd className="text-soft">{item.period}</dd>
                  </div>
                </dl>
                <div className="ml-auto flex flex-col items-end gap-1 text-right">
                  {item.note && (
                    <span className="text-[0.65rem] normal-case text-soft">
                      {item.note}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2 text-accent transition-colors group-hover:underline">
                    <span>{item.status}</span>
                    <span aria-hidden>↗</span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
