import { Avatar, Button, Column, Flex, Heading, Line, Tag, Text } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";

import { baseURL } from "@/app/resources";
import { home, person, work } from "@/app/resources/content";

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
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Home() {
  return (
    <Column maxWidth="l" gap="xl" horizontal="center">
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

      <section className={styles.hero}>
        <Column gap="20" className={styles.heroCopy}>
          <Flex gap="8" wrap>
            <Tag variant="brand" size="s">
              {home.eyebrow}
            </Tag>
            <Tag variant="neutral" size="s">
              {person.location}
            </Tag>
          </Flex>
          <Heading as="h1" variant="display-strong-xl" className={styles.heroTitle}>
            {home.headline}
          </Heading>
          <Text variant="heading-default-xl" onBackground="neutral-weak" className={styles.lead}>
            {home.intro}
          </Text>
          <Text variant="body-default-l" onBackground="neutral-medium" className={styles.subline}>
            {home.subline}
          </Text>
          <Flex gap="16" wrap>
            <Button id="selected-work" href={home.primaryCta.href} variant="primary" size="m" arrowIcon>
              {home.primaryCta.label}
            </Button>
            <Button href={home.secondaryCta.href} variant="secondary" size="m">
              {home.secondaryCta.label}
            </Button>
          </Flex>
        </Column>

        <Column className={styles.heroAside} gap="20">
          <Flex className={styles.identityCard} gap="16" vertical="center">
            <Avatar src={person.avatar} size="l" />
            <Column gap="4">
              <Text variant="heading-strong-l">{person.name}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {person.role}
              </Text>
            </Column>
          </Flex>
          <div className={styles.statementCard}>
            <Text variant="body-default-m" onBackground="neutral-strong">
              {person.tagline}
            </Text>
          </div>
          <div className={styles.statementCard}>
            <Text variant="body-default-s" onBackground="neutral-medium">
              {person.availability}
            </Text>
          </div>
        </Column>
      </section>

      <section className={styles.section}>
        <Flex mobileDirection="column" fillWidth gap="l">
          <Column flex={4} gap="12">
            <Text className={styles.sectionLabel}>What I build</Text>
            <Heading as="h2" variant="display-strong-s">
              Product systems that connect customer experience with operational reality.
            </Heading>
          </Column>
          <Column flex={6} gap="12">
            {home.specialties.map((item) => (
              <div key={item} className={styles.specialtyRow}>
                <Text variant="heading-default-s">{item}</Text>
              </div>
            ))}
          </Column>
        </Flex>
      </section>

      <section className={styles.section}>
        <Flex mobileDirection="column" fillWidth gap="l" className={styles.sectionHeader}>
          <Column flex={4} gap="12">
            <Text className={styles.sectionLabel}>Selected work</Text>
            <Heading as="h2" variant="display-strong-s">
              Four recent projects that show how I work across mobile, platform, and verification layers.
            </Heading>
          </Column>
          <Column flex={6} gap="12">
            <Text variant="body-default-m" onBackground="neutral-medium">
              {work.intro}
            </Text>
          </Column>
        </Flex>
        <Projects slugs={work.featuredProjectSlugs} />
      </section>

      <section className={styles.section}>
        <div className={styles.credibilityPanel}>
          <Flex mobileDirection="column" gap="l" fillWidth>
            <Column flex={4} gap="12">
              <Text className={styles.sectionLabel}>Why this portfolio is structured this way</Text>
              <Heading as="h2" variant="display-strong-s">
                The strongest signal in my work is not a single interface. It is how the pieces fit together.
              </Heading>
            </Column>
            <Column flex={6} gap="16">
              {home.credibility.map((item) => (
                <Column key={item} gap="12">
                  <Text variant="body-default-m" onBackground="neutral-strong">
                    {item}
                  </Text>
                  <Line />
                </Column>
              ))}
            </Column>
          </Flex>
        </div>
      </section>
    </Column>
  );
}
