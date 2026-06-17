"use client";

import { useEffect } from "react";

export function AOSInit() {
  useEffect(() => {
    Promise.all([import("aos"), import("aos/dist/aos.css")]).then(
      ([{ default: AOS }]) => {
        AOS.init({
          duration: 600,
          easing: "ease-out-cubic",
          once: true,
          offset: 80,
          disable: () =>
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
      },
    );
  }, []);

  return null;
}
