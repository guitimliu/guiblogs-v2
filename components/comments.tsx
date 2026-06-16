"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type CommentsProps = {
  identifier: string;
  url: string;
  title: string;
};

type DisqusConfig = {
  page: { identifier: string; url: string; title: string };
  language: string;
};

declare global {
  interface Window {
    DISQUS?: { reset: (config: { reload: boolean }) => void };
    disqus_config?: (this: DisqusConfig) => void;
  }
}

export function Comments({ identifier, url, title }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    window.disqus_config = function () {
      this.page.identifier = identifier;
      this.page.url = url;
      this.page.title = title;
      this.language = "zh_TW";
    };

    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://${site.disqusShortname}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", String(Date.now()));
    script.async = true;
    document.body.appendChild(script);
  }, [visible, identifier, url, title]);

  return (
    <section ref={containerRef} className="mt-12 border-t border-line pt-10">
      <div id="disqus_thread" />
      <noscript>
        請啟用 JavaScript 才能瀏覽{" "}
        <a href="https://disqus.com/?ref_noscript" className="text-accent">
          Disqus 提供的留言
        </a>
        。
      </noscript>
    </section>
  );
}
