import Image from "next/image";
import { getProfile } from "@/lib/data";

export function Hero() {
  const profile = getProfile();

  return (
    <section className="py-12 sm:py-16">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="shrink-0">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={140}
            height={140}
            priority
            className="rounded-full border border-line bg-surface"
          />
        </div>
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <p className="font-mono text-xs tracking-wide text-muted">
            {profile.location}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
            {profile.name}
          </h1>
          <div className="mt-5 max-w-prose space-y-4 leading-loose text-soft">
            {profile.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:justify-start">
            {profile.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
