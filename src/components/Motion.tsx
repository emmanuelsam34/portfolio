"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

import { Scraps } from "./Scraps";
import styles from "./Motion.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

const NOTES: Record<string, string> = {
  "/": "back to the start",
  "/work": "the good stuff",
  "/about": "the backstory",
};

const noteFor = (path: string) => NOTES[path] ?? (path.startsWith("/work/") ? "the details" : "");

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

interface MotionProps {
  word: string;
}

/**
 * Site-wide motion, modelled on the reference:
 *  - Lenis smooth scrolling, synced with ScrollTrigger
 *  - torn-letter paper wipe between pages
 *  - big headlines rise in line by line as they scroll into view
 * Everything is skipped when the visitor prefers reduced motion.
 */
export function Motion({ word }: MotionProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const wipeRef = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const reduce = useRef(false);

  // Smooth scrolling (once)
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // Intercept internal links and play the paper wipe before navigating
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (reduce.current || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noWipe !== undefined) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) return; // same page (incl. #hash): let it scroll
      // Capture phase: stop Next's <Link> from navigating before the wipe has played
      e.preventDefault();
      e.stopPropagation();
      leave(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leave = (href: string) => {
    const wipe = wipeRef.current;
    if (!wipe || pending.current) return;
    pending.current = true;
    const panel = wipe.querySelector(`.${styles.panel}`);
    const scraps = wipe.querySelectorAll(".scrap");
    const note = wipe.querySelector(`.${styles.note}`) as HTMLElement;
    const wordEl = wipe.querySelector(`.${styles.word}`);
    note.textContent = noteFor(href.split(/[?#]/)[0]);
    gsap.set(wipe, { visibility: "visible", pointerEvents: "auto" });
    gsap.set(wordEl, { scale: 1, opacity: 1 });
    gsap
      .timeline({ onComplete: () => router.push(href, { scroll: true }) })
      .fromTo(panel, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "expo.inOut" })
      .fromTo(
        scraps,
        { y: -60, opacity: 0, rotate: () => gsap.utils.random(-25, 25) },
        { y: 0, opacity: 1, rotate: () => gsap.utils.random(-7, 7), duration: 0.5, stagger: 0.045, ease: "back.out(2)" },
        0.3,
      )
      .fromTo(note, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, 0.55);
  };

  // On every new page: finish the wipe (zoom through the first letter), then set up reveals
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    const wipe = wipeRef.current;

    const finish = () =>
      new Promise<void>((resolve) => {
        if (!pending.current || !wipe) return resolve();
        pending.current = false;
        const panel = wipe.querySelector(`.${styles.panel}`);
        const wordEl = wipe.querySelector(`.${styles.word}`) as HTMLElement;
        const note = wipe.querySelector(`.${styles.note}`);
        const first = wipe.querySelector(".scrap") as HTMLElement;
        const o = first.getBoundingClientRect();
        const wr = wordEl.getBoundingClientRect();
        gsap.set(wordEl, { transformOrigin: `${o.left - wr.left + o.width / 2}px ${o.height / 2}px` });
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(wipe, { visibility: "hidden", pointerEvents: "none" });
              gsap.set(panel, { clipPath: "inset(100% 0 0 0)", opacity: 1 });
              resolve();
            },
          })
          .to(note, { opacity: 0, duration: 0.2 })
          .to(wordEl, { scale: 26, duration: 0.9, ease: "expo.in" }, 0.05)
          .to(panel, { opacity: 0, duration: 0.35, ease: "none" }, 0.7);
      });

    let splits: SplitText[] = [];
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    finish().then(() => {
      if (cancelled || reduce.current) return;
      ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>("main [data-split]").forEach((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
          splits.push(split);
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((s) => s.revert());
      splits = [];
    };
  }, [pathname]);

  return (
    <div ref={wipeRef} className={styles.wipe} aria-hidden="true">
      <div className={`${styles.panel} crumple`}>
        <Scraps word={word} seed={7} className={styles.word} />
        <div className={styles.note} />
      </div>
    </div>
  );
}
