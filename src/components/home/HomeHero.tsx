"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

import { Scraps } from "@/components/Scraps";
import styles from "./HomeHero.module.scss";

interface Shot {
  src: string;
  name: string;
}

interface HomeHeroProps {
  name: string;
  greeting: string;
  lead: string;
  body: string;
  avatar: string;
  avatarAlt: string;
  photoNote: string;
  shots: Shot[];
  nowLabel: string;
  nowTitle: string;
  workThumb: string;
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export function HomeHero(props: HomeHeroProps) {
  const root = useRef<HTMLElement>(null);
  const [shot, setShot] = useState(0);

  // Cycle the project shots in the phone card
  useEffect(() => {
    if (props.shots.length < 2) return;
    const id = window.setInterval(() => setShot((i) => (i + 1) % props.shots.length), 2600);
    return () => window.clearInterval(id);
  }, [props.shots.length]);

  // Entrance, hover wobble, pointer parallax and the slow float
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const scraps = gsap.utils.toArray<HTMLElement>(".scrap", el);
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 0.15 })
        .fromTo(
          scraps,
          { opacity: 0, y: -80, rotate: () => gsap.utils.random(-30, 30) },
          { opacity: 1, y: 0, rotate: () => gsap.utils.random(-6, 6), duration: 1, stagger: 0.06, ease: "back.out(1.6)" },
        )
        .fromTo(`.${styles.cut}`, { opacity: 0, y: 120, rotate: -8 }, { opacity: 1, y: 0, rotate: -3, duration: 1.4 }, 0.1)
        .fromTo(`.${styles.intro}`, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, 0.5)
        .fromTo(`.${styles.side}`, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1 }, 0.7)
        .fromTo(`.${styles.door}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.7)
        .fromTo(`.${styles.noteWrap} path`, { strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 1.2)
        .fromTo(`.${styles.noteWrap} .hand`, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.2);

      gsap.to(`.${styles.cut}`, { y: -8, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });

      // letters wobble like loose paper when hovered
      scraps.forEach((s) =>
        s.addEventListener("pointerenter", () =>
          gsap.fromTo(
            s,
            { rotate: gsap.utils.random(-14, 14) },
            { rotate: gsap.utils.random(-6, 6), duration: 1.2, ease: "elastic.out(1,.3)" },
          ),
        ),
      );

      if (window.matchMedia("(pointer: fine)").matches) {
        const layers: [string, number][] = [
          [`.${styles.name}`, -10],
          [`.${styles.cut} > div`, 18],
          [`.${styles.side}`, 26],
          [`.${styles.intro}`, -12],
        ];
        const movers = layers.map(([sel, depth]) => ({
          x: gsap.quickTo(sel, "x", { duration: 1.2, ease: "power3" }),
          y: gsap.quickTo(sel, "y", { duration: 1.2, ease: "power3" }),
          depth,
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * m.depth);
            m.y(ny * m.depth);
          });
        };
        el.addEventListener("pointermove", onMove);
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={styles.hero}>
      <h1 className="sr-only">{`${props.name}. ${props.lead}`}</h1>
      <Scraps word={props.name.split(" ")[0].toUpperCase()} seed={3} className={styles.name} />

      <div className={styles.mid}>
        <div className={styles.intro}>
          <span className={`hand ${styles.greeting}`}>{props.greeting}</span>
          <p>
            <b>{props.lead}</b> {props.body}
          </p>
          <div className={styles.ctas}>
            <Link className="btn btn-solid" href="/work">
              See the work <Arrow />
            </Link>
            <a className="btn btn-ghost" href="#contact">
              Say hi
            </a>
          </div>
        </div>

        <div className={styles.cut}>
          <div className={`sticker ${styles.photo}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={props.avatar} alt={props.avatarAlt} fetchPriority="high" />
          </div>
          <div className={styles.noteWrap} aria-hidden="true">
            <span className="hand">{props.photoNote}</span>
            <svg viewBox="0 0 90 60" className="scribble">
              <path d="M84 6 C 60 4, 30 14, 14 46 M14 46 L 10 30 M14 46 L 30 42" strokeDasharray="120" />
            </svg>
          </div>
        </div>

        <div className={styles.side}>
          <Link className={styles.clip} href="/work" aria-label="See the projects">
            {props.shots.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.src} src={s.src} alt="" className={i === shot ? styles.on : undefined} loading={i < 2 ? "eager" : "lazy"} />
            ))}
            <span className={styles.clipTag}>Shipping</span>
            <span className={styles.clipName}>{props.shots[shot]?.name}</span>
          </Link>
          <div className={styles.now}>
            <span className={styles.eq} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              <small>{props.nowLabel}</small>
              <b>{props.nowTitle}</b>
            </span>
          </div>
        </div>
      </div>

      <nav className={styles.doors} aria-label="Explore">
        <Link className={styles.door} href="/work">
          <span className={styles.doorPic}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={props.workThumb} alt="" />
          </span>
          <span className={styles.doorTxt}>
            <small>Apps and platforms</small>
            <b>Work</b>
          </span>
          <span className={styles.doorGo}>
            <Arrow />
          </span>
        </Link>
        <Link className={styles.door} href="/about">
          <span className={styles.doorPic}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={props.avatar} alt="" />
          </span>
          <span className={styles.doorTxt}>
            <small>Story and CV</small>
            <b>About</b>
          </span>
          <span className={styles.doorGo}>
            <Arrow />
          </span>
        </Link>
        <a className={styles.door} href="#contact">
          <span className={`${styles.doorPic} ${styles.doorStar} crumple`} />
          <span className={styles.doorTxt}>
            <small>Email and socials</small>
            <b>Contact</b>
          </span>
          <span className={styles.doorGo}>
            <Arrow />
          </span>
        </a>
      </nav>
    </section>
  );
}
