"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

import { CopyEmail } from "./CopyEmail";
import styles from "./SiteChrome.module.scss";

interface Social {
  name: string;
  link: string;
}

interface SiteChromeProps {
  footer: ReactNode;
  email: string;
  availability: string;
  socials: Social[];
}

/**
 * Hides the footer on the full-screen home page. There, "#contact" links
 * (Say hi, the Contact door) open a small contact card instead of scrolling.
 */
export function SiteChrome({ footer, email, availability, socials }: SiteChromeProps) {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // "#contact" with no footer on the page -> open the card
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href="#contact"]');
      if (!a || document.getElementById("contact")) return;
      e.preventDefault();
      e.stopPropagation();
      lastFocus.current = a as HTMLElement;
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const card = cardRef.current;
    window.__lenis?.stop();
    if (card && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(card, { opacity: 0, y: 24, rotate: -3 }, { opacity: 1, y: 0, rotate: -1, duration: 0.6, ease: "expo.out" });
    }
    card?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      lastFocus.current?.focus();
    };
  }, [open]);

  return (
    <>
      {!isHome && footer}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div
            ref={cardRef}
            className={styles.card}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
            <span className="eyebrow">Say hi</span>
            <h2 id="contact-title" className={`display ${styles.title}`}>
              Let&apos;s build <span className="accent-word">something.</span>
            </h2>
            <p className={styles.copy}>{availability}</p>
            <div className={styles.actions}>
              <a className="btn btn-solid" href={`mailto:${email}`}>
                {email}
              </a>
              <CopyEmail email={email} className="btn btn-ghost" />
            </div>
            <ul className={styles.socials}>
              {socials
                .filter((s) => s.link && !s.link.startsWith("mailto:"))
                .map((s) => (
                  <li key={s.name}>
                    <a href={s.link} target="_blank" rel="noopener noreferrer">
                      {s.name} ↗
                    </a>
                  </li>
                ))}
            </ul>
            <span className={`hand ${styles.note}`}>I reply faster than my CI runs</span>
          </div>
        </div>
      )}
    </>
  );
}
