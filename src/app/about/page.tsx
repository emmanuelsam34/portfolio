import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/about/Timeline";
import { Services } from "@/components/shared/Services";
import { baseURL } from "@/app/resources";
import { about, home, person, social, work } from "@/app/resources/content";

import styles from "./about-page.module.scss";

export async function generateMetadata() {
  const title = about.title;
  const description = about.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/about`,
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

/* A short curved arrow; the right-hand labels use it mirrored */
const Arrow = () => (
  <svg viewBox="0 0 54 20" aria-hidden="true">
    <path d="M2 10 C 18 2, 34 18, 50 10" />
    <path d="M50 10 L42 5 M50 10 L43 16" />
  </svg>
);

export default function About() {
  const years = new Date().getFullYear() - about.sinceYear;
  const toolkit = about.technical.skills.flatMap((skill) => skill.description.split(",").map((item) => item.trim()));
  const tagSpots = [
    { side: "left", top: "30%" },
    { side: "right", top: "22%" },
    { side: "left", top: "58%" },
    { side: "right", top: "52%" },
  ] as const;

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: person.name,
            jobTitle: person.role,
            description: about.description,
            url: `https://${baseURL}/about`,
            sameAs: social.filter((item) => !item.link.startsWith("mailto:")).map((item) => item.link),
          }),
        }}
      />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className="eyebrow">About</span>
          <h1 data-split className="display display-xl">
            Hi, I&apos;m <span className="accent-word">{person.firstName}.</span>
          </h1>
          <p className="lede">{about.intro.description}</p>
          <p className={styles.story}>{about.story}</p>
          <dl className={styles.facts}>
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="btn-row">
            {about.calendar.display && (
              <a href={about.calendar.link} className="btn btn-solid" target="_blank" rel="noopener noreferrer">
                {about.calendar.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            )}
            <a href="/work" className="btn btn-ghost">
              See the work
            </a>
          </div>
        </div>

        <div className={styles.whatido}>
          <span className={`display display-l ${styles.whatTitle}`}>What I do</span>
          <div className={`sticker ${styles.whatImg}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={person.avatar} alt={person.name} />
          </div>
          {(about.tags ?? home.annotations).slice(0, 4).map((tag, i) => (
            <span
              key={tag}
              className={`${styles.tag} ${tagSpots[i].side === "right" ? styles.tagRight : ""}`}
              style={{ top: tagSpots[i].top, animationDelay: `${0.8 + i * 0.15}s` }}
            >
              <span className="hand">{tag}</span>
              <Arrow />
            </span>
          ))}
        </div>
      </section>

      {/* ---------- The full list of services ---------- */}
      <Services eyebrow="The full list" title="What I do, properly" note={work.services.note} groups={work.services.groups} />

      {/* ---------- Work history ---------- */}
      <Timeline
        eyebrow="Work history"
        title={`${about.sinceYear} to now`}
        lede={`${years} years, one thread: products that behave like one system.`}
        jobs={about.timeline}
      />

      {/* ---------- Toolkit ---------- */}
      <section className={styles.cv}>
        <Reveal>
          <span className="eyebrow">Toolkit</span>
          <h2 data-split className="display display-m">
            The stack
          </h2>
          <div className={styles.chips}>
            {toolkit.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="eyebrow">Focus</span>
          <h2 data-split className="display display-m">
            Good at
          </h2>
          <div className={`${styles.chips} ${styles.chipsColumn}`}>
            {home.specialties.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className={styles.elsewhere}>
            {social.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target={item.link.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
              >
                {item.name} ↗
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
