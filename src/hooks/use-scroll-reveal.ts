import { useEffect } from "react";

type ScrollRevealOptions = {
  selector?: string;
  threshold?: number;
  rootMargin?: string;
  deps?: readonly unknown[];
};

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { selector = "[data-reveal]", threshold = 0.12, rootMargin = "0px 0px -5% 0px", deps } = options;

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => !el.classList.contains("is-visible"));
    if (els.length === 0) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold, rootMargin },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootMargin, selector, threshold, ...(deps ?? [])]);
}
