import { Projects } from "@/components/work/Projects";
import { baseURL } from "@/app/resources";
import { person, work } from "@/app/resources/content";

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

export default function Work() {
  const platforms = Array.from(new Set(work.featuredProjects.map((p) => p.platform)));

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
            hasPart: work.featuredProjects.map((project) => ({
              "@type": "CreativeWork",
              headline: project.name,
              description: project.summary,
              url: `https://${baseURL}/work/${project.slug}`,
            })),
          }),
        }}
      />

      <section className={`wrap ${styles.hero}`}>
        <span className="eyebrow">Work</span>
        <h1 className="display display-xl">
          Here&apos;s what
          <br />
          I&apos;ve been <span className="accent-word">building.</span>
        </h1>
        <div className={styles.heroBottom}>
          <p className="lede">{work.intro}</p>
          <div className={styles.platforms}>
            <span className={`hand ${styles.platformNote}`}>across {platforms.length} kinds of platform</span>
            <div className="chips">
              {platforms.map((platform) => (
                <span key={platform} className="chip">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.band}>
        <div className="wrap">
          <Projects slugs={work.featuredProjectSlugs} />
        </div>
      </section>
    </>
  );
}
