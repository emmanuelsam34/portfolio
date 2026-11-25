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
  /** A right hand photo with a transparent background; it is mirrored for the left side. Falls back to a drawn hand. */
  handSrc?: string;
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

      // Phones: two hands play a gentle tug-of-war with the name.
      // Each hand slides in from fully off-screen on its own side, grips an end
      // letter with a slight squeeze, then they take turns pulling: slow, eased
      // and small, with the letters trailing and tilting a little toward the
      // puller. They ease the name back to centre, let go softly and slide
      // back out the way they came. Then a pause, and it repeats.
      const mm = gsap.matchMedia();
      mm.add("(max-width: 560px)", () => {
        const right = el.querySelector<HTMLElement>(`.${styles.grabber}[data-side="right"]`);
        const left = el.querySelector<HTMLElement>(`.${styles.grabber}[data-side="left"]`);
        const nameBox = el.querySelector<HTMLElement>(`.${styles.nameWrap}`);
        if (!right || !left || !nameBox || scraps.length < 2) return;
        const first = scraps[0];
        const last = scraps[scraps.length - 1];
        const n = scraps.length;
        let base: number[] = scraps.map(() => 0);
        let offR = 300; // distance that takes each hand fully off-screen
        let offL = -300;

        // Letters drift toward whoever is pulling; nearer letters move a touch sooner and lean a touch more
        const pull = (dx: number, from: "start" | "end", duration: number) => ({
          x: dx,
          rotate: (i: number) => {
            const nearness = from === "end" ? i / (n - 1) : 1 - i / (n - 1);
            return base[i] + Math.sign(dx) * (1 + nearness * 4);
          },
          duration,
          ease: "sine.inOut",
          stagger: { each: 0.05, from },
        });

        // Park each hand on its letter's outer edge and work out how far off-screen it starts
        const place = () => {
          gsap.set([right, left], { x: 0 });
          const wb = nameBox.getBoundingClientRect();
          const lb = last.getBoundingClientRect();
          const fb = first.getBoundingClientRect();
          const hw = right.offsetWidth;
          const hh = right.offsetHeight;
          // fingers overlap the outer edge of each end letter, like a grip
          gsap.set(right, { left: lb.right - wb.left - hw * 0.38, top: lb.top - wb.top + lb.height * 0.5 - hh * 0.55 });
          gsap.set(left, { left: fb.left - wb.left - hw * 0.62, top: fb.top - wb.top + fb.height * 0.5 - hh * 0.55 });
          offR = window.innerWidth - right.getBoundingClientRect().left + 12;
          offL = -left.getBoundingClientRect().right - 12;
          gsap.set(right, { x: offR, opacity: 1 });
          gsap.set(left, { x: offL, opacity: 1 });
        };
        window.addEventListener("resize", place);

        // repeatRefresh re-reads the off-screen distances on every loop
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 2.2, repeatRefresh: true, defaults: { ease: "sine.inOut" } });
        tl.call(() => {
          if (!base.some(Boolean)) base = scraps.map((s) => Number(gsap.getProperty(s, "rotate")) || 0);
          place();
        })
          // slide in from each edge
          .fromTo(right, { x: () => offR, rotate: 8, scale: 1 }, { x: 0, rotate: -3, duration: 1.1, ease: "power2.out" })
          .fromTo(left, { x: () => offL, rotate: -8, scale: 1 }, { x: 0, rotate: 3, duration: 1.1, ease: "power2.out" }, "<0.15")
          // grip: a slight squeeze
          .to([right, left], { scale: 0.95, duration: 0.35 }, ">-0.05")
          // right hand pulls, the left is drawn along a little behind
          .addLabel("pullR")
          .to(scraps, pull(16, "end", 1.2), "pullR")
          .to(right, { x: 18, rotate: -6, duration: 1.2 }, "pullR")
          .to(left, { x: 13, rotate: 4, duration: 1.2 }, "pullR+=0.1")
          // left hand pulls it back the other way
          .addLabel("pullL")
          .to(scraps, pull(-16, "start", 1.4), "pullL")
          .to(left, { x: -18, rotate: 6, duration: 1.4 }, "pullL")
          .to(right, { x: -13, rotate: -2, duration: 1.4 }, "pullL+=0.1")
          // both ease the name back to the middle, with a soft settle
          .addLabel("settle")
          .to(scraps, { x: 0, rotate: (i: number) => base[i], duration: 1.1, ease: "back.out(1.6)", stagger: { each: 0.04, from: "center" } }, "settle")
          .to([right, left], { x: 0, duration: 1, ease: "power2.out" }, "settle")
          // let go, then slide back out the way they came
          .to([right, left], { scale: 1, rotate: 0, duration: 0.35 }, "settle+=0.7")
          .to(right, { x: () => offR, rotate: 8, duration: 1, ease: "power2.in" }, ">0.1")
          .to(left, { x: () => offL, rotate: -8, duration: 1, ease: "power2.in" }, "<0.08");

        return () => {
          window.removeEventListener("resize", place);
          tl.kill();
          gsap.set(scraps, { x: 0, rotate: (i: number) => base[i] });
        };
      });

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
      <div className={styles.nameWrap}>
        <Scraps word={props.name.split(" ")[0].toUpperCase()} seed={3} className={styles.name} />
        {/* Phones only: two hands that fight over the name */}
        {(["left", "right"] as const).map((side) => (
          <span key={side} className={styles.grabber} data-side={side} aria-hidden="true">
            {props.handSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={props.handSrc} alt="" />
            ) : (
              <svg viewBox="0 0 48 56">
                <path d="M14 30V12a3.5 3.5 0 0 1 7 0v14M21 24V8a3.5 3.5 0 0 1 7 0v16M28 25V11a3.5 3.5 0 0 1 7 0v15M35 27v-9a3.5 3.5 0 0 1 7 0v16c0 10-7 18-16 18h-2c-6 0-10-3-13-8l-6-10a3.5 3.5 0 0 1 6-4l4 5" />
              </svg>
            )}
          </span>
        ))}
      </div>

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
