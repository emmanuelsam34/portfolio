"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./Timeline.module.scss";

gsap.registerPlugin(ScrollTrigger);

export interface Job {
  year: string;
  role: string;
  company: string;
  span: string;
  points: string[];
}

interface TimelineProps {
  eyebrow: string;
  title: string;
  lede: string;
  jobs: Job[];
}

/**
 * Work history on a rail. Desktop: horizontal; the rail fills as you scroll
 * and each dot lights up when reached. When the cards are wider than the
 * screen the section pins and slides sideways, like the reference.
 * Phones: vertical, filling downward. Reduced motion: everything shown lit.
 */
export function Timeline({ eyebrow, title, lede, jobs }: TimelineProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = gsap.utils.toArray<HTMLElement>(`.${styles.job}`, el);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((j) => j.classList.add(styles.on));
      return;
    }
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const track = el.querySelector<HTMLElement>(`.${styles.track}`)!;
      const fill = el.querySelector<HTMLElement>(`.${styles.line} i`)!;
      const light = (p: number) =>
        items.forEach((j, i) => j.classList.toggle(styles.on, p >= i / Math.max(1, items.length - 1) - 0.02));

      mm.add("(min-width: 761px)", () => {
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const pinned = dist() > 80;
        gsap
          .timeline({
            scrollTrigger: pinned
              ? {
                  trigger: el,
                  start: "top top",
                  end: () => `+=${dist()}`,
                  pin: `.${styles.pin}`,
                  scrub: 1,
                  invalidateOnRefresh: true,
                  onUpdate: (s) => light(s.progress),
                }
              : {
                  trigger: `.${styles.rail}`,
                  start: "top 75%",
                  end: "bottom 45%",
                  scrub: 1,
                  onUpdate: (s) => light(s.progress),
                },
          })
          .to(track, { x: () => -dist(), ease: "none" }, 0)
          .fromTo(fill, { width: "0%" }, { width: "100%", ease: "none" }, 0);
      });

      mm.add("(max-width: 760px)", () => {
        gsap.fromTo(
          fill,
          { height: "0%" },
          { height: "100%", ease: "none", scrollTrigger: { trigger: `.${styles.rail}`, start: "top 70%", end: "bottom 70%", scrub: true } },
        );
        items.forEach((j) =>
          ScrollTrigger.create({
            trigger: j,
            start: "top 72%",
            onEnter: () => j.classList.add(styles.on),
            onLeaveBack: () => j.classList.remove(styles.on),
          }),
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={styles.tl}>
      <div className={styles.pin}>
        <div className={styles.head}>
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 data-split className="display display-l">
              {title}
            </h2>
          </div>
          <p className="lede">{lede}</p>
        </div>
        <div className={styles.rail}>
          <div className={styles.line}>
            <i />
          </div>
          <ol className={styles.track}>
            {jobs.map((j) => (
              <li key={`${j.year}-${j.company}`} className={styles.job}>
                <div className={styles.year}>{j.year}</div>
                <div className={styles.dot} aria-hidden="true" />
                <div className={styles.card}>
                  <b>{j.role}</b>
                  <span className={styles.co}>{j.company}</span>
                  <span className={styles.span}>{j.span}</span>
                  <ul>
                    {j.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
