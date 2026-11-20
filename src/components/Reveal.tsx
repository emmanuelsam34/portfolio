"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import classNames from "classnames";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}

/** Fades content up as it scrolls into view. Content stays visible without JS. */
export function Reveal({ children, as: Tag = "div", className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </Tag>
  );
}
