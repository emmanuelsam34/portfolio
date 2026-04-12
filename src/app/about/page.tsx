import { Avatar, Button, Column, Flex, Heading, LetterFx, RevealFx, SmartImage, Grid, Text } from "@/once-ui/components";

import { baseURL } from "@/app/resources";
import { about, person, social } from "@/app/resources/content";

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
  return (
    <Column maxWidth="l" className={styles.page}>
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

      <div className={styles.hero}>
        <Flex mobileDirection="column" gap="l" fillWidth>
          <Column flex={4} gap="24">
            <Avatar src={person.avatar} size="xl" />
            <Column gap="8">
              <Heading as="h1" variant="display-strong-l">
                <LetterFx trigger="instant">
                  {person.name}
                </LetterFx>
              </Heading>
              <Text variant="heading-default-l" onBackground="neutral-weak">
                {person.role}
              </Text>
            </Column>
            <Flex gap="12" wrap>
              {about.calendar.display && (
                <Button href={about.calendar.link} variant="primary" size="m">
                  {about.calendar.label}
                </Button>
              )}
              {social.map((item) => (
                <Button key={item.name} href={item.link} variant="secondary" size="s" prefixIcon={item.icon}>
                  {item.name}
                </Button>
              ))}
            </Flex>
          </Column>
          <Column flex={6} gap="24">
            <Text variant="body-default-l" onBackground="neutral-medium">
              {about.intro.description}
            </Text>
            <Flex gap="12" direction="column">
              {about.profile.map((paragraph) => (
                <Text key={paragraph} variant="body-default-l" onBackground="neutral-strong">
                  {paragraph}
                </Text>
              ))}
            </Flex>
          </Column>
        </Flex>
      </div>

      <div className={styles.panel}>
        <Column gap="16">
          <Text className={styles.sectionLabel}>{about.work.title}</Text>
          <Heading as="h2" variant="display-strong-s">
            Experience shaped by product delivery, platform coordination, and long-lived systems.
          </Heading>
          <div className={styles.timeline}>
            {about.work.experiences.map((experience) => (
              <div key={`${experience.company}-${experience.role}`} className={styles.timelineItem}>
                <Flex mobileDirection="column" gap="12" fillWidth>
                  <Column flex={5} gap="4">
                    <Text variant="heading-strong-l">{experience.company}</Text>
                    <Text variant="body-default-s" onBackground="brand-weak">
                      {experience.role}
                    </Text>
                  </Column>
                  <Column flex={7} gap="12">
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {experience.timeframe}
                    </Text>
                    <Column as="ul" gap="8" className={styles.list}>
                      {experience.achievements.map((item) => (
                        <Text as="li" key={item} variant="body-default-s" onBackground="neutral-strong">
                          {item}
                        </Text>
                      ))}
                    </Column>
                  </Column>
                </Flex>
              </div>
            ))}
          </div>
        </Column>
      </div>

      <div className={styles.panel}>
        <Column gap="16">
          <Text className={styles.sectionLabel}>{about.capabilities.title}</Text>
          <Heading as="h2" variant="display-strong-s">
            Where I add the most value.
          </Heading>
          <div className={styles.grid}>
            {about.capabilities.groups.map((group) => (
              <div key={group.title} className={styles.capabilityCard}>
                <Column gap="12">
                  <Text variant="heading-strong-l">{group.title}</Text>
                  <Column as="ul" gap="8" className={styles.list}>
                    {group.items.map((item) => (
                      <Text as="li" key={item} variant="body-default-s" onBackground="neutral-strong">
                        {item}
                      </Text>
                    ))}
                  </Column>
                </Column>
              </div>
            ))}
          </div>
        </Column>
      </div>

      <div className={styles.panel}>
        <Column gap="16">
          <Text className={styles.sectionLabel}>{about.technical.title}</Text>
          <Heading as="h2" variant="display-strong-s">
            Core tools I reach for.
          </Heading>
          <div className={styles.grid}>
            {about.technical.skills.map((skill) => (
              <div key={skill.title} className={styles.capabilityCard}>
                <Column gap="8">
                  <Text variant="heading-strong-l">{skill.title}</Text>
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    {skill.description}
                  </Text>
                </Column>
              </div>
            ))}
          </div>
        </Column>
      </div>

      <div className={styles.panel}>
        <Column gap="12">
          <Text className={styles.sectionLabel}>{about.contact.title}</Text>
          <Heading as="h2" variant="display-strong-s">
            Open to building with teams that care about product quality and systems thinking.
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-medium">
            {about.contact.description}
          </Text>
          <Flex gap="12" wrap>
            <Button href={`mailto:${person.email}`} variant="primary" size="m">
              Email Emmanuel
            </Button>
            {about.calendar.display && (
              <Button href={about.calendar.link} variant="secondary" size="m">
                Book a call
              </Button>
            )}
          </Flex>
        </Column>
      </div>
    </Column>
  );
}
