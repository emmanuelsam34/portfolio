import Link from "next/link";

import { Reveal } from "@/components/Reveal";
import { TornEdge } from "@/components/TornEdge";
import { WorkReel, type ReelItem } from "@/components/work/WorkReel";
import { Services } from "@/components/shared/Services";
import { baseURL } from "@/app/resources";
import { about, person, work } from "@/app/resources/content";

import styles from "./work-page.module.scss";

export async function generateMetadata() {
  const title = work.title;
  const description = work.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/work/`,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");
const sized = (url: string, w: number) => url.replace("w=1600", `w=${w}`);

export default function Work() {
  const projects = work.featuredProjects;
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const platforms = Array.from(new Set(projects.map((p) => p.platform)));
  const years = new Date().getFullYear() - about.sinceYear;

  const reel: ReelItem[] = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    platform: p.platform,
    year: p.year,
    tagline: p.tagline,
    image: sized(p.images[0], 900),
    brief: p.summary,
    did: p.responsibilities[0],
    result: p.highlights.slice(0, 3).join(" · "),
    resultShort: p.highlights.slice(0, 2).join(" · "),
  }));

  const stack = Array.from(new Set(projects.flatMap((p) => p.stack)));
  const n = work.numbers;

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            headline: work.title,
            description: work.description,
            url: `https://${baseURL}/work`,
            author: {
              "@type": "Person",
              name: person.name,
            },
            hasPart: projects.map((project) => ({
              "@type": "CreativeWork",
              headline: project.name,
              description: project.summary,
              url: `https://${baseURL}/work/${project.slug}`,
            })),
          }),
        }}
      />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className="eyebrow">Work</span>
          <h1 data-split className="display display-xl">
            Here&apos;s what I&apos;ve been <span className="accent-word">building.</span>
          </h1>
          <p className="lede">{work.heroLead}</p>
          <div className="btn-row">
            <a className="btn btn-solid" href="#reel">
              See the reel <span aria-hidden="true">↓</span>
            </a>
            <a className="btn btn-ghost" href="#contact">
              Work with me
            </a>
          </div>
          <dl className={styles.meta}>
            <div>
              <dt>{projects.length}</dt>
              <dd>case studies on this page</dd>
            </div>
            <div>
              <dt>{years}+</dt>
              <dd>years shipping</dd>
            </div>
            <div>
              <dt>{platforms.length}</dt>
              <dd>kinds of platform</dd>
            </div>
          </dl>
        </div>

        <div className={styles.fan} aria-hidden="true">
          {projects.slice(0, 3).map((p, i) => (
            <span key={p.slug} className={`sticker ${styles.fanCard}`} style={{ ["--i" as string]: i }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sized(p.images[0], 700)} alt="" />
            </span>
          ))}
          <span className={`hand ${styles.fanNote}`}>{work.heroNote}</span>
          <svg viewBox="0 0 90 60" className={`scribble ${styles.fanArrow}`}>
            <path d="M6 8 C 30 4, 62 16, 78 46 M78 46 L 82 30 M78 46 L 62 42" />
          </svg>
        </div>
      </section>

      {/* ---------- The reel ---------- */}
      <WorkReel items={reel} hint={work.reelHint} />

      {/* ---------- Full list ---------- */}
      <section className={styles.list}>
        <Reveal className={styles.listHead}>
          <div>
            <span className="eyebrow">The full list</span>
            <h2 data-split className="display display-l">
              Every build, <span className="accent-word">in one place</span>
            </h2>
          </div>
          <p className="lede">{work.intro}</p>
        </Reveal>
        <ol className={styles.rows}>
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className={styles.row}>
                <span className={styles.rowNum}>{pad(i + 1)}</span>
                <span className={styles.rowThumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sized(p.images[0], 240)} alt="" loading="lazy" />
                </span>
                <span className={styles.rowMain}>
                  <b>{p.name}</b>
                  <span>{p.tagline}</span>
                </span>
                <span className={styles.rowMeta}>
                  {p.platform}
                  <small>{p.year}</small>
                </span>
                <span className={styles.rowGo} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Stack ticker ---------- */}
      <section className={styles.band} aria-label="Tools used across these projects">
        <TornEdge side="top" seed={21} />
        <div className={styles.bandRow}>
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ))}
        </div>
        <TornEdge side="bottom" seed={22} />
      </section>

      {/* ---------- By the numbers ---------- */}
      <section className={styles.ana}>
        <Reveal className={styles.anaCopy}>
          <span className="eyebrow">{n.eyebrow}</span>
          <h2 data-split className="display display-m">
            {n.title}
          </h2>
          {n.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </Reveal>
        <div className={styles.anaPhones} aria-hidden="true">
          {n.phones.map((slug) => {
            const p = bySlug.get(slug);
            return p ? (
              <figure key={slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sized(p.images[0], 600)} alt="" loading="lazy" />
                <figcaption>{p.name.replace("LIBL Classroom ", "")}</figcaption>
              </figure>
            ) : null;
          })}
        </div>
        <div className={styles.anaStats}>
          {n.stats.map((s, i) => {
            const wide = "wide" in s && s.wide ? bySlug.get(s.wide as string) : undefined;
            return (
              <Reveal key={s.label} delay={i * 0.06} className={`${styles.stat} ${wide ? styles.statWide : ""} ${i === 0 ? "crumple" : ""}`}>
                <span>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </span>
                {wide && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sized(wide.images[0], 200)} alt="" loading="lazy" />
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <Services eyebrow="Services" title="Things you can hire me for" note={work.services.note} groups={work.services.groups} />
    </>
  );
}
