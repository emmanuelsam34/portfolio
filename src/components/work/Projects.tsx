import { getPosts } from "@/app/utils/utils";
import { Grid } from "@/once-ui/components";
import { ProjectCard } from "@/components";
import { work } from "@/app/resources/content";

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
    <Grid columns={2} mobileColumns={1} fillWidth gap="m">
      {orderedProjects.map((entry, index) => (
        <ProjectCard
          priority={index < 2}
          key={entry.post.slug}
          href={`/work/${entry.post.slug}`}
          images={entry.project.images.length > 0 ? entry.project.images : entry.post.metadata.images}
          title={entry.project.name}
          description={entry.project.tagline}
          summary={entry.project.summary}
          platform={entry.project.platform}
          status={entry.project.status}
          year={entry.project.year}
          stack={entry.project.stack}
          highlights={entry.project.highlights}
          link={entry.post.metadata.link || entry.project.link || ""}
        />
      ))}
    </Grid>
  );
}
