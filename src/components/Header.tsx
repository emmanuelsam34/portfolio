"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

import styles from "@/components/Header.module.scss";
import { routes } from "@/app/resources";
import { person } from "@/app/resources/content";

const navItems = [
  { href: "/work", label: "Work", hint: "Case studies", match: (p: string) => p.startsWith("/work") },
  { href: "/about", label: "About", hint: "Story and CV", match: (p: string) => p.startsWith("/about") },
  { href: `mailto:${person.email}`, label: "Contact", hint: "Say hi", match: () => false },
];

export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.identity} aria-label={`${person.name}, home`}>
          <span className={styles.mark} aria-hidden="true">
            {person.firstName[0]}
            {person.lastName[0]}
          </span>
          <span className={styles.identityText}>
            <span>{person.name}</span>
            <span className={styles.identityRole}>Engineer, {person.location.split(",")[0]}</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {navItems
            .filter((item) => !item.href.startsWith("/") || routes[item.href as keyof typeof routes])
            .map((item) => {
              const active = item.match(pathname);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={classNames(styles.link, active && styles.active)}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={styles.hint}>{item.hint}</span>
                  <span className={styles.label}>{item.label}</span>
                </a>
              );
            })}
        </nav>
      </div>
    </header>
  );
};
