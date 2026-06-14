import { getFeaturedWorks } from "@/lib/data";
import { WorkCard } from "@/components/home/work-card";

export function WorksGrid() {
  const works = getFeaturedWorks();

  return (
    <section className="border-t border-line py-12 sm:py-16">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl italic">
          Works<span className="not-italic text-accent">。</span>
        </h2>
        <p className="font-mono text-xs tracking-wide text-muted">
          {works.length} projects
        </p>
      </div>
      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
        {works.map((work) => (
          <WorkCard key={work.title} work={work} />
        ))}
      </div>
    </section>
  );
}
