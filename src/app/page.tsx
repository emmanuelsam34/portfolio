import Link from "next/link";

import { Projects } from "@/components/work/Projects";
import { Reveal } from "@/components/Reveal";
import { baseURL } from "@/app/resources";
import { home, person, work, about } from "@/app/resources/content";

import styles from "./home.module.scss";

export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}`,
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

const HOME_PROJECT_COUNT = 4;

export default function Home() {
  const years = new Date().getFullYear() - about.sinceYear;
  const platforms = new Set(work.featuredProjects.map((p) => p.platform)).size;
  const stats = [
    { value: `${work.featuredProjects.length}`, label: "case studies here" },
    { value: `${years}+`, label: "years shipping" },
    { value: `${platforms}`, label: "kinds of platform" },
  ];
  const toolkit = about.technical.skills.flatMap((skill) =>
    skill.description.split(",").map((item) => item.trim()),
  );

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: home.title,
            description: home.description,
            url: `https://${baseURL}`,
            image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
            about: {
              "@type": "Person",
              name: person.name,
              jobTitle: person.role,
            },
          }),
        }}
      />

      {/* ---------- Hero ---------- */}
      <section className={`wrap ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <div className={styles.nameTag}>
            <span className={styles.name}>{person.name}</span>
            <span className={styles.role}>{person.role}</span>
          </div>
          <h1 className={`display display-xl ${styles.heroTitle}`}>
            {home.heroLines.map((line) => (
              <span key={line} className={styles.line}>
                {line}
              </span>
            ))}
            <span className={styles.line}>
              <span className="accent-word">{home.heroAccent}</span>
            </span>
          </h1>
          <p className="lede">{home.intro}</p>
          <div className="btn-row">
            <a href="#work" className="btn btn-solid">
              See the work <span aria-hidden="true">↓</span>
            </a>
            <a href="#contact" className="btn btn-ghost">
              Say hi
            </a>
          </div>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.heroVisual}>
          <span className={`hand ${styles.caption}`}>{home.photoCaption}</span>
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
      </section>

      {/* ---------- Selected work ---------- */}
      <section id="work" className={styles.band}>
        <div className="wrap">
          <Reveal className={styles.sectionHead}>
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="display display-l">
                Things I&apos;ve <span className="accent-word">shipped.</span>
              </h2>
            </div>
            <p className="lede">{work.intro}</p>
          </Reveal>

          <Projects slugs={work.featuredProjectSlugs.slice(0, HOME_PROJECT_COUNT)} />

          <div className={styles.bandFooter}>
            <span className={`hand ${styles.scrollNote}`}>there&apos;s more where that came from</span>
            <Link href="/work" className="btn btn-solid">
              See all {work.featuredProjects.length} projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- What I do ---------- */}
      <section className={`wrap ${styles.split}`}>
        <Reveal className={styles.splitHead}>
          <span className="eyebrow">{about.capabilities.title}</span>
          <h2 className="display display-l">What I actually do</h2>
          <span className={`hand ${styles.splitNote}`}>yes, all of it ↴</span>
        </Reveal>
        <div className={styles.capabilities}>
          {about.capabilities.groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.1} className={`card ${styles.capability}`}>
              <span className={styles.capNumber}>0{i + 1}</span>
              <h3 className="display display-s">{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Toolkit ---------- */}
      <section className={`wrap ${styles.toolkit}`}>
        <Reveal>
          <span className="eyebrow">Toolkit</span>
          <h2 className="display display-m">The stack</h2>
          <div className={`chips ${styles.toolkitChips}`}>
            {toolkit.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="eyebrow">Specialties</span>
          <h2 className="display display-m">Good at</h2>
          <ul className={styles.specialties}>
            {home.specialties.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
