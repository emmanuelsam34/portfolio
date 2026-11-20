import { Reveal } from "@/components/Reveal";
import { baseURL } from "@/app/resources";
import { about, home, person, social } from "@/app/resources/content";

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

export default function About() {
  const currentYear = new Date().getFullYear();

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
      <section className={`wrap ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <span className="eyebrow">About</span>
          <h1 className="display display-xl">
            Hi, I&apos;m
            <br />
            <span className="accent-word">{person.firstName}.</span>
          </h1>
          <p className="lede">{about.intro.description}</p>

          <dl className={styles.facts}>
            {about.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="btn-row">
            {about.calendar.display && (
              <a href={about.calendar.link} className="btn btn-solid" target="_blank" rel="noopener noreferrer">
                {about.calendar.label} <span aria-hidden="true">↗</span>
              </a>
            )}
            <a href="/work" className="btn btn-ghost">
              See the work
            </a>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <h2 className={`display display-m ${styles.visualTitle}`}>What I do</h2>
          <div className={styles.photoWrap}>
            <div className={`sticker ${styles.photo}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={person.avatar} alt={person.name} />
            </div>
            {home.annotations.map((note, i) => (
              <span key={note} className={`hand ${styles.note} ${styles[`note${i + 1}`]}`}>
                ← {note}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Story ---------- */}
      <section className={`wrap ${styles.story}`}>
        <Reveal>
          <span className="eyebrow">The longer version</span>
        </Reveal>
        <div className={styles.storyBody}>
          {about.profile.map((paragraph, i) => (
            <Reveal key={paragraph} delay={i * 0.08} as="p">
              {paragraph}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Work history ---------- */}
      <section className={`wrap ${styles.section}`}>
        <Reveal className={styles.sectionHead}>
          <div>
            <span className="eyebrow">Work history</span>
            <h2 className="display display-l">
              {about.sinceYear} to now
            </h2>
          </div>
          <p className="lede">
            {currentYear - about.sinceYear} years, one thread: products that behave like one system.
          </p>
        </Reveal>

        <ol className={styles.timeline}>
          {about.work.experiences.map((experience) => (
            <Reveal as="li" key={`${experience.company}-${experience.role}`} className={styles.job}>
              <span className={styles.jobTime}>{experience.timeframe}</span>
              <div>
                <h3 className="display display-s">{experience.company}</h3>
                <span className={styles.jobRole}>{experience.role}</span>
              </div>
              <ul className={styles.jobList}>
                {experience.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------- Toolkit ---------- */}
      <section className={`wrap ${styles.section}`}>
        <Reveal>
          <span className="eyebrow">{about.technical.title}</span>
          <h2 className={`display display-l ${styles.toolTitle}`}>Tools I reach for</h2>
        </Reveal>
        <div className={styles.toolGrid}>
          {about.technical.skills.map((skill, i) => (
            <Reveal key={skill.title} delay={i * 0.06} className={`card ${styles.toolCard}`}>
              <h3 className="display display-s">{skill.title}</h3>
              <div className="chips">
                {skill.description.split(",").map((item) => (
                  <span key={item} className="chip chip-outline">
                    {item.trim()}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Elsewhere ---------- */}
      <section className={`wrap ${styles.section}`}>
        <Reveal className={styles.elsewhere}>
          <span className="eyebrow">Elsewhere</span>
          <div className="chips">
            {social.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="btn btn-ghost"
                target={item.link.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
              >
                {item.name} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
