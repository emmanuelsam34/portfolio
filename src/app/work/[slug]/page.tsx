import { notFound } from "next/navigation";

import { CustomMDX, getHeadings } from "@/components/mdx";
import { TornEdge } from "@/components/TornEdge";
import { Toc } from "@/components/work/Toc";
import ScrollToHash from "@/components/ScrollToHash";
import { getPosts } from "@/app/utils/utils";
import Link from "next/link";
import { baseURL } from "@/app/resources";
import { person, work } from "@/app/resources/content";

import styles from "../project-page.module.scss";

const pad = (n: number) => String(n).padStart(2, "0");

interface WorkParams {
  params: {
    slug: string;
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPosts(["src", "app", "work", "projects"]).map((post) => ({
    slug: post.slug,
  }));
}

function getProjectBundle(slug: string) {
  const post = getPosts(["src", "app", "work", "projects"]).find((entry) => entry.slug === slug);
  const project = work.featuredProjects.find((entry) => entry.slug === slug);

  if (!post || !project) {
    return null;
  }

  return { post, project };
}

export function generateMetadata({ params: { slug } }: WorkParams) {
  const bundle = getProjectBundle(slug);

  if (!bundle) {
    return;
  }

  const { post, project } = bundle;
  const firstImage = post.metadata.images?.[0];
  const ogImage = firstImage
    ? firstImage.startsWith("http")
      ? firstImage
      : `https://${baseURL}${firstImage}`
    : `https://${baseURL}/og?title=${encodeURIComponent(project.name)}`;

  return {
    title: project.name,
    description: project.summary,
    openGraph: {
      title: project.name,
      description: project.summary,
      type: "website",
      url: `https://${baseURL}/work/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.summary,
      images: [ogImage],
    },
  };
}

export default function Project({ params }: WorkParams) {
  const bundle = getProjectBundle(params.slug);

  if (!bundle) {
    notFound();
  }

  const { post, project } = bundle;
  const order = work.featuredProjectSlugs;
  const nextSlug = order[(order.indexOf(project.slug) + 1) % order.length];
  const next = nextSlug !== project.slug ? work.featuredProjects.find((p) => p.slug === nextSlug) : undefined;
  const index = Math.max(0, order.indexOf(project.slug));
  const total = order.length;
  const headings = getHeadings(post.content);
  const coverNote = project.platform.toLowerCase().includes("mobile") ? "in your pocket" : project.platform.toLowerCase().includes("infra") ? "the bit nobody sees" : "the real thing";

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: project.name,
            description: project.summary,
            applicationCategory: project.platform,
            operatingSystem: "Web and mobile",
            url: `https://${baseURL}/work/${post.slug}`,
            creator: {
              "@type": "Person",
              name: person.name,
            },
          }),
        }}
      />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Link href="/work" className={styles.back}>
            <span aria-hidden="true">←</span> All work
          </Link>
          <span className="eyebrow">
            Case study {pad(index + 1)}/{pad(total)} · {project.platform}
          </span>
          <h1 data-split className={`display display-l ${styles.title}`}>
            {project.name}
          </h1>
          <p className="lede">{project.tagline}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>{project.platform}</dd>
            </div>
            <div>
              <dt>Built with</dt>
              <dd>{project.stack.slice(0, 3).join(", ")}</dd>
            </div>
          </dl>
          <div className="btn-row">
            <a className="btn btn-solid" href="#story">
              Read the story <span aria-hidden="true">↓</span>
            </a>
            {next && (
              <Link className="btn btn-ghost" href={`/work/${next.slug}`}>
                Next project
              </Link>
            )}
          </div>
        </div>

        {project.images.length > 0 && (
          <div className={styles.cover}>
            <div className={`sticker ${styles.coverImg}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.images[0]} alt="" fetchPriority="high" />
            </div>
            <span className={`hand ${styles.coverNote}`}>{coverNote}</span>
          </div>
        )}
      </section>

      {/* ---------- The short version ---------- */}
      <section className={`${styles.short} crumple`}>
        <TornEdge side="top" seed={31 + index} />
        <div className={styles.shortInner}>
          <div className={styles.shortHead}>
            <span className="eyebrow">The short version</span>
            <span className={`hand ${styles.shortNote}`}>for the skimmers</span>
          </div>
          <div className={styles.shortCols}>
            <div>
              <h2>The brief</h2>
              <p>{project.summary}</p>
            </div>
            <div>
              <h2>What I did</h2>
              <ul>
                {project.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>The result</h2>
              <ul>
                {project.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <TornEdge side="bottom" seed={41 + index} />
      </section>

      {/* ---------- The full story ---------- */}
      <section className={styles.story} id="story">
        <aside className={styles.aside}>
          <div className={styles.asideInner}>
            {headings.length > 1 && <Toc headings={headings} />}
            <div>
              <span className="eyebrow">Stack</span>
              <div className={styles.stack}>
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <article className={styles.article}>
          <CustomMDX source={post.content} />
        </article>
      </section>

      {/* ---------- Up next ---------- */}
      {next && (
        <section className={styles.next}>
          <span className={`hand ${styles.nextNote}`}>up next →</span>
          <Link href={`/work/${next.slug}`} className={`${styles.nextLink} crumple`}>
            <span className={styles.nextCopy}>
              <span className="eyebrow">
                {pad(((index + 1) % total) + 1)}/{pad(total)} · {next.platform}
              </span>
              <span className="display display-l">{next.name}</span>
              <span className={styles.nextTag}>{next.tagline}</span>
            </span>
            <span className={`sticker ${styles.nextImg}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={next.images[0].replace("w=1600", "w=700")} alt="" loading="lazy" />
            </span>
          </Link>
        </section>
      )}
      <ScrollToHash />
    </>
  );
}
