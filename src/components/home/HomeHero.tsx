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

      // Phones: two hands, one from each side, play tug-of-war with the name.
      // The left hand grips the first letter, the right hand the last. Each pull
      // drags the letters toward the puller (staggered from its end, tilting with
      // the strain) and drags the other hand along. Then both let go and the
      // letters spring back with an elastic wobble.
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

        // Letters lean toward whoever is pulling; the nearer a letter is to the puller, the sooner and harder it moves
        const tug = (dx: number, from: "start" | "end", duration: number) => ({
          x: dx,
          rotate: (i: number) => {
            const nearness = from === "end" ? i / (n - 1) : 1 - i / (n - 1);
            return base[i] + Math.sign(dx) * (3 + nearness * 9);
          },
          duration,
          ease: "power3.inOut",
          stagger: { each: 0.03, from },
        });

        // Park each hand on its letter's outer edge (measured once the letters have settled)
        const place = () => {
          const wb = nameBox.getBoundingClientRect();
          const lb = last.getBoundingClientRect();
          const fb = first.getBoundingClientRect();
          const hw = right.offsetWidth;
          const hh = right.offsetHeight;
          // fingers overlap the outer edge of each end letter, like a grip
          gsap.set(right, { left: lb.right - wb.left - hw * 0.38, top: lb.top - wb.top + lb.height * 0.5 - hh * 0.55 });
          gsap.set(left, { left: fb.left - wb.left - hw * 0.62, top: fb.top - wb.top + fb.height * 0.5 - hh * 0.55 });
        };
        window.addEventListener("resize", place);

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.4, delay: 2.4 });
        tl.call(() => {
          if (!base.some(Boolean)) base = scraps.map((s) => Number(gsap.getProperty(s, "rotate")) || 0);
          place();
        })
          // both hands reach in from their own side and grab
          .fromTo(right, { opacity: 0, x: 70, y: 16, rotate: 18, scale: 1 }, { opacity: 1, x: 0, y: 0, rotate: -6, duration: 0.55, ease: "power3.out" })
          .fromTo(left, { opacity: 0, x: -70, y: 16, rotate: -18, scale: 1 }, { opacity: 1, x: 0, y: 0, rotate: 6, duration: 0.55, ease: "power3.out" }, "<0.12")
          .to([right, left], { scale: 0.88, duration: 0.14, ease: "power2.in" })
          // round 1: right pulls, left is dragged along
          .addLabel("r1")
          .to(scraps, tug(26, "end", 0.5), "r1")
          .to(right, { x: 30, rotate: -12, duration: 0.5, ease: "power3.inOut" }, "r1")
          .to(left, { x: 22, rotate: 14, duration: 0.5, ease: "power3.inOut" }, "r1+=0.06")
          // round 2: left yanks it back, harder
          .addLabel("r2")
          .to(scraps, tug(-34, "start", 0.45), "r2")
          .to(left, { x: -38, rotate: 16, duration: 0.45, ease: "power3.inOut" }, "r2")
          .to(right, { x: -26, rotate: -2, duration: 0.45, ease: "power3.inOut" }, "r2+=0.06")
          // round 3: right wins a quick tug
          .addLabel("r3")
          .to(scraps, tug(18, "end", 0.32), "r3")
          .to(right, { x: 22, rotate: -14, duration: 0.32, ease: "power2.inOut" }, "r3")
          .to(left, { x: 14, rotate: 10, duration: 0.32, ease: "power2.inOut" }, "r3+=0.05")
          // round 4: a short stalemate shake
          .addLabel("r4")
          .to(scraps, tug(-8, "start", 0.18), "r4")
          .to(left, { x: -10, duration: 0.18, ease: "power1.inOut" }, "r4")
          .to(right, { x: -4, duration: 0.18, ease: "power1.inOut" }, "r4")
          // both let go at once
          .to([right, left], { scale: 1, duration: 0.12 })
          .addLabel("free")
          .to(scraps, { x: 0, rotate: (i: number) => base[i], duration: 1.3, ease: "elastic.out(1, 0.35)", stagger: { each: 0.025, from: "center" } }, "free")
          .to(right, { x: 80, y: -14, rotate: 22, opacity: 0, duration: 0.45, ease: "power2.in" }, "free+=0.05")
          .to(left, { x: -80, y: -14, rotate: -22, opacity: 0, duration: 0.45, ease: "power2.in" }, "free+=0.05");

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
