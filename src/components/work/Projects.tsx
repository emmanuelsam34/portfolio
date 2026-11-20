import { getPosts } from "@/app/utils/utils";
import { ProjectCard } from "@/components";
import { Reveal } from "@/components/Reveal";
import { work } from "@/app/resources/content";

import styles from "./Projects.module.scss";

interface ProjectsProps {
  slugs?: string[];
}

export function Projects({ slugs }: ProjectsProps) {
  const allPosts = getPosts(["src", "app", "work", "projects"]);
  const desiredOrder = slugs ?? work.featuredProjectSlugs;

  const postsBySlug = new Map(allPosts.map((post) => [post.slug, post]));
  const projectsBySlug = new Map(work.featuredProjects.map((project) => [project.slug, project]));

  const orderedProjects = desiredOrder
    .map((slug) => {
      const post = postsBySlug.get(slug);
      const project = projectsBySlug.get(slug);

      if (!post || !project) {
        return null;
      }

      return { post, project };
    })
    .filter((entry): entry is { post: (typeof allPosts)[number]; project: (typeof work.featuredProjects)[number] } => Boolean(entry));

  return (
    <div className={styles.grid}>
      {orderedProjects.map((entry, index) => (
        <Reveal key={entry.post.slug} delay={(index % 2) * 0.12} className={styles.item}>
          <ProjectCard
            index={index}
            total={orderedProjects.length}
            priority={index < 2}
            href={`/work/${entry.post.slug}`}
            images={entry.project.images.length > 0 ? entry.project.images : entry.post.metadata.images}
            title={entry.project.name}
            description={entry.project.tagline}
            platform={entry.project.platform}
            year={entry.project.year}
            stack={entry.project.stack}
          />
        </Reveal>
      ))}
    </div>
  );
}
