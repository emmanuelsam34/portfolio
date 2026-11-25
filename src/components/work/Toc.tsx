"use client";

import { useEffect, useState } from "react";

import styles from "./Toc.module.scss";

interface TocProps {
  headings: { text: string; id: string }[];
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "On this page" menu: glides to a section on click and highlights the one being read. */
export function Toc({ headings }: TocProps) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const onScroll = () => {
      // the last heading that has passed 35% of the viewport is the one being read
      const line = window.innerHeight * 0.35;
      let current = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -96, duration: 1.1 });
    else el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="On this page">
      <span className="eyebrow">On this page</span>
      <ol className={styles.toc}>
        {headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => go(e, h.id)}
              className={active === h.id ? styles.active : undefined}
              aria-current={active === h.id ? "location" : undefined}
            >
              <i>{pad(i + 1)}</i>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
