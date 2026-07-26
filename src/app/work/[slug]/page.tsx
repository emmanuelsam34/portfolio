import { notFound } from "next/navigation";

import { CustomMDX } from "@/components/mdx";
import ScrollToHash from "@/components/ScrollToHash";
import { getPosts } from "@/app/utils/utils";
import { Button, Column, Flex, SmartImage, Tag, Text, Heading, RevealFx, LetterFx, TiltFx } from "@/once-ui/components";
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

  return (
    <Column as="section" maxWidth="l" horizontal="center" className={styles.page}>
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

      <div className={styles.hero}>
        <Column gap="20">
          <Button href="/work" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
            Back to selected work
          </Button>

          <div className={styles.heroGrid}>
            <Column gap="16">
              <Flex gap="8" wrap>
                <Tag variant="neutral" size="s">
                  {project.platform}
                </Tag>
                <Tag variant="brand" size="s">
                  {project.status}
                </Tag>
                <Tag variant="accent" size="s">
                  {project.year}
                </Tag>
              </Flex>
              <Heading as="h1" variant="display-strong-l">
                <LetterFx trigger="instant">
                  {project.name}
                </LetterFx>
              </Heading>
              <Text variant="heading-default-l" onBackground="neutral-weak">
                {project.tagline}
              </Text>
              <Text variant="body-default-l" onBackground="neutral-medium">
                {project.summary}
              </Text>
            </Column>

            <Column gap="12">
              <div className={styles.metaCard}>
                <Column gap="8">
                  <Text className={styles.sectionLabel}>Highlights</Text>
                  {project.highlights.map((item) => (
                    <Text key={item} variant="body-default-s" onBackground="neutral-strong">
                      {item}
                    </Text>
                  ))}
                </Column>
              </div>
              <div className={styles.metaCard}>
                <Column gap="8">
                  <Text className={styles.sectionLabel}>Core stack</Text>
                  <Flex gap="8" wrap>
                    {project.stack.map((item) => (
                      <Tag key={item} variant="neutral" size="s">
                        {item}
                      </Tag>
                    ))}
                  </Flex>
                </Column>
              </div>
            </Column>
          </div>
        </Column>
      </div>

      <RevealFx speed="slow" fillWidth>
        {post.metadata.images.length > 0 && (
          <TiltFx>
            <SmartImage
              priority
              aspectRatio="16 / 9"
              radius="l"
              alt={project.name}
              src={post.metadata.images[0]}
            />
          </TiltFx>
        )}
      </RevealFx>

      <Column style={{ margin: "auto" }} as="article" maxWidth="s">
        <CustomMDX source={post.content} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
