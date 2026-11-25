"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

import styles from "@/components/Header.module.scss";
import { person } from "@/app/resources/content";

const navItems = [
  { href: "/work", label: "Work", match: (p: string) => p.startsWith("/work") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
];

export const Header = () => {
  const pathname = usePathname() ?? "";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={classNames(styles.header, scrolled && styles.scrolled)}>
      <span className={styles.bg} aria-hidden="true" />
      <Link href="/" className={styles.logo} aria-label={`${person.name}, home`}>
        {person.firstName.toLowerCase()}
        <span className={styles.dot}>.</span>
      </Link>

      <nav className={styles.pill} aria-label="Main">
        {navItems.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(styles.link, active && styles.active)}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
        <a href="#contact" className={styles.cta}>
          Say hi
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </nav>
    </header>
  );
};
