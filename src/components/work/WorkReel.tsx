"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { TornEdge } from "@/components/TornEdge";
import styles from "./WorkReel.module.scss";

gsap.registerPlugin(ScrollTrigger);

export interface ReelItem {
  slug: string;
  name: string;
  platform: string;
  year: string;
  tagline: string;
  image: string;
  brief: string;
  did: string;
  result: string;
  /** Shorter result for phones, where the pinned screen has little room */
  resultShort: string;
}

interface WorkReelProps {
  items: ReelItem[];
  hint: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The pinned project reel, modelled on the reference: while the section is
 * pinned, scrolling flips through every project (counter, name, framed shot,
 * brief / what I did / result). Previous / next buttons do the same for
 * keyboard users; with reduced motion there is no pin and only the buttons.
 */
export function WorkReel({ items, hint }: WorkReelProps) {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [index, setIndex] = useState(0);
  const current = items[index];
  const total = items.length;

  useEffect(() => {
    const el = root.current;
    const pin = pinRef.current;
    if (!el || !pin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const bg = pin.querySelector(`.${styles.bgText}`);
      triggerRef.current = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.7 * (total - 1)}`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const next = Math.min(total - 1, Math.round(self.progress * (total - 1)));
          setIndex((prev) => (prev === next ? prev : next));
          if (bg) gsap.set(bg, { xPercent: -self.progress * 55 });
        },
      });
    }, el);
    return () => {
      ctx.revert();
      triggerRef.current = null;
    };
  }, [total]);

  // Flip animation whenever the project changes
  useEffect(() => {
    const pin = pinRef.current;
    if (!pin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      pin.querySelectorAll("[data-flip]"),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "expo.out", overwrite: true },
    );
    gsap.fromTo(
      pin.querySelector(`.${styles.frame}`),
      { rotate: index % 2 ? 3 : -3, scale: 0.96 },
      { rotate: index % 2 ? -1.5 : 1.5, scale: 1, duration: 0.7, ease: "expo.out", overwrite: true },
    );
  }, [index]);

  // Buttons scroll to the matching point when pinned, or just switch when not
  const go = useCallback(
    (to: number) => {
      const next = Math.max(0, Math.min(total - 1, to));
      const st = triggerRef.current;
      if (st) {
        const y = st.start + ((st.end - st.start) * next) / (total - 1) + 2;
        if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.9 });
        else window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        setIndex(next);
      }
    },
    [total],
  );

  return (
    <section ref={root} className={`${styles.reel} crumple`} id="reel" aria-roledescription="carousel" aria-label="Project reel">
      <TornEdge side="top" seed={11} className={styles.edgeTop} />
      <div ref={pinRef} className={styles.pin}>
        <span className={styles.bgText} aria-hidden="true">
          {items.map((i) => i.name).join("  ·  ")}
        </span>

        {/* Left: counter and project */}
        <div className={`${styles.side} ${styles.left}`}>
          <span className="eyebrow">The reel</span>
          <p className={styles.count} aria-live="polite">
            {pad(index + 1)}
            <small>/{pad(total)}</small>
          </p>
          <h2 className={styles.name} data-flip>
            {current.name}
          </h2>
          <p className={styles.type} data-flip>
            {current.platform} · {current.year}
          </p>
          <p className={styles.desc} data-flip>
            {current.tagline}
          </p>
        </div>

        {/* Centre: the framed shot */}
        <div className={styles.center}>
          <Link href={`/work/${current.slug}`} className={styles.frame} aria-label={`Read the ${current.name} case study`}>
            {items.map((item, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.slug}
                src={item.image}
                alt=""
                className={i === index ? styles.on : undefined}
                loading={i < 2 ? "eager" : "lazy"}
              />
            ))}
            <span className={styles.frameTag}>Case study</span>
            <span className={styles.frameCta}>
              Read it <span aria-hidden="true">→</span>
            </span>
          </Link>
          <div className={styles.controls}>
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous project">
              ←
            </button>
            <button type="button" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Next project">
              →
            </button>
          </div>
        </div>

        {/* Right: brief, what I did, result */}
        <div className={`${styles.side} ${styles.right}`}>
          <dl className={styles.facts}>
            <div data-flip>
              <dt>The brief</dt>
              <dd>{current.brief}</dd>
            </div>
            <div data-flip>
              <dt>What I did</dt>
              <dd>{current.did}</dd>
            </div>
            <div data-flip>
              <dt>The result</dt>
              <dd>{current.result}</dd>
            </div>
          </dl>
        </div>

        {/* Phones: compact header and facts */}
        <div className={styles.mob}>
          <p className={styles.count}>
            {pad(index + 1)}
            <small>/{pad(total)}</small>
          </p>
          <p className={styles.mobName} data-flip>
            {current.name}
          </p>
        </div>
        <dl className={styles.mobInfo}>
          <div className={styles.full} data-flip>
            <dt>The brief</dt>
            <dd>{current.tagline}</dd>
          </div>
          <div className={styles.full} data-flip>
            <dt>The result</dt>
            <dd>{current.resultShort}</dd>
          </div>
        </dl>

        <span className={`hand ${styles.hint}`}>{hint}</span>
      </div>
      <TornEdge side="bottom" seed={12} className={styles.edgeBottom} />
    </section>
  );
}
