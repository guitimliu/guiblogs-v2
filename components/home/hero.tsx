import Image from "next/image";
import { getProfile } from "@/lib/data";

export function Hero() {
  const profile = getProfile();

  return (
    <section className="py-12 sm:py-16" data-aos="fade-up">
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-12">
        <div className="shrink-0 sm:mt-6">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={160}
            height={160}
            priority
            className="rounded-full border border-line bg-surface"
          />
        </div>
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <p className="hidden items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted sm:flex">
            <span aria-hidden className="h-px w-6 bg-line" />
            {profile.location}
          </p>
          <h1 className="font-display text-5xl leading-none tracking-tight sm:mt-3 sm:text-6xl">
            {profile.name}
            <span className="text-accent">。</span>
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-soft">
            {profile.tagline}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-muted sm:hidden">
            {profile.location}
          </p>
          <div className="mt-7 max-w-prose space-y-4 leading-loose text-soft">
            {profile.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wide sm:justify-start">
            {profile.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-baseline gap-1.5 text-muted transition-colors hover:text-accent"
                >
                  <span className="underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent">
                    {link.label}
                  </span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
