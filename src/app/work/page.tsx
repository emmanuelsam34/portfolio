import { Column, Flex, Heading, Text } from "@/once-ui/components";
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
  return (
    <Column maxWidth="l" className={styles.page}>
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

      <div className={styles.hero}>
        <Flex mobileDirection="column" fillWidth gap="xl" vertical="center">
          <Column flex={5} gap="16">
            <Text className={styles.sectionLabel}>Selected work</Text>
            <Heading as="h1" variant="display-strong-s">
              Product case studies across mobile apps, platform operations, and compliance workflows.
            </Heading>
          </Column>
          <Column flex={7} gap="16">
            <Text variant="body-default-l" onBackground="neutral-medium">
              {work.intro}
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              The featured projects below are arranged intentionally to show the full system: tutor-facing mobile experiences, student booking flows, internal admin tooling, and verification orchestration.
            </Text>
          </Column>
        </Flex>
      </div>

      <Projects slugs={work.featuredProjectSlugs} />
    </Column>
  );
}
