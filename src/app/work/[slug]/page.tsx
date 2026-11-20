import { notFound } from "next/navigation";

import { CustomMDX } from "@/components/mdx";
import ScrollToHash from "@/components/ScrollToHash";
import { getPosts } from "@/app/utils/utils";
import Link from "next/link";
import { baseURL } from "@/app/resources";
import { person, work } from "@/app/resources/content";

import styles from "../project-page.module.scss";

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

      <section className={`wrap ${styles.hero}`}>
        <Link href="/work" className={styles.back}>
          <span aria-hidden="true">←</span> All work
        </Link>
        <span className="eyebrow">
          {project.platform} · {project.year}
        </span>
        <h1 className={`display display-l ${styles.title}`}>{project.name}</h1>
        <p className={`lede ${styles.tagline}`}>{project.tagline}</p>
      </section>

      <section className={`wrap ${styles.overview}`}>
        <div className={styles.summary}>
          <span className="eyebrow">The brief</span>
          <p>{project.summary}</p>
        </div>
        <aside className={styles.meta}>
          <div className={`card ${styles.metaCard}`}>
            <span className="eyebrow">Status</span>
            <p>{project.status}</p>
          </div>
          <div className={`card ${styles.metaCard}`}>
            <span className="eyebrow">Highlights</span>
            <ul>
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={`card ${styles.metaCard}`}>
            <span className="eyebrow">Stack</span>
            <div className="chips">
              {project.stack.map((item) => (
                <span key={item} className="chip chip-outline">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {project.images.length > 0 && (
        <section className={`wrap ${styles.cover}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.images[0]} alt="" />
        </section>
      )}

      <article className={`wrap ${styles.article}`}>
        <CustomMDX source={post.content} />
      </article>

      {next && (
        <section className={`wrap ${styles.next}`}>
          <span className="hand">up next →</span>
          <Link href={`/work/${next.slug}`} className={styles.nextLink}>
            <span className="eyebrow">{next.platform}</span>
            <span className="display display-m">{next.name}</span>
          </Link>
        </section>
      )}
      <ScrollToHash />
    </>
  );
}
