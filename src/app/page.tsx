import { Avatar, Button, Column, Flex, Grid, Heading, LetterFx, Line, RevealFx, SmartImage, Tag, Text, TiltFx } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";

import { baseURL } from "@/app/resources";
import { home, person, work, social, about } from "@/app/resources/content";

// Force re-save to fix ReferenceError: about is not defined

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

      <Column fillWidth gap="24" vertical="center" horizontal="center" paddingY="l" className={styles.hero}>
        <Flex
          paddingX="12"
          paddingY="4"
          radius="full"
          border="neutral-alpha-medium"
          background="neutral-alpha-weak"
          vertical="center"
          gap="8"
        >
          <Text variant="body-default-xs" onBackground="brand-strong">Emmanuel</Text>
          <Line vert height="12" />
          <Text variant="body-default-xs" onBackground="neutral-weak">Agbedejobi</Text>
        </Flex>

        <Column gap="12" horizontal="center">
          <Heading as="h1" variant="display-strong-xl" align="center">
            <LetterFx trigger="instant">
              Building connected product experiences.
            </LetterFx>
          </Heading>
          <Text variant="heading-default-xl" onBackground="neutral-weak" className={styles.heroIntro} align="center">
            {home.intro}
          </Text>
        </Column>

        <Button href="/about" variant="secondary" size="s" className={styles.identityButton} style={{ borderRadius: '100px' }}>
          <Flex gap="8" vertical="center">
            <Avatar src={person.avatar} size="s" />
            <Text variant="body-default-s">About – {person.name}</Text>
          </Flex>
        </Button>


      </Column>

      <Flex fillWidth gap="xl" mobileDirection="column">
        <Column flex={7} gap="l">
          <Flex vertical="center" gap="12">
            <Text className={styles.sectionLabel}>Selected Work</Text>
          </Flex>
          <RevealFx delay={0.2} fillWidth>
            <Projects slugs={work.featuredProjectSlugs} />
          </RevealFx>
        </Column>

        <Grid gap="l" className={styles.aside} mobileColumns={1} style={{ flex: 3 }}>
          <RevealFx delay={0.4} fillWidth>
            <Flex className={styles.asideCard} direction="column" gap="16">
              <Text className={styles.sectionLabel}>About</Text>
              <Text variant="body-default-m" onBackground="neutral-strong">
                {person.tagline}
              </Text>
            </Flex>
          </RevealFx>

          <RevealFx delay={0.5} fillWidth>
            <Flex className={styles.asideCard} direction="column" gap="16">
              <Text className={styles.sectionLabel}>Focus</Text>
              <Flex gap="8" wrap>
                {home.specialties.map((item) => (
                  <Tag key={item} variant="neutral" size="s">
                    {item}
                  </Tag>
                ))}
              </Flex>
            </Flex>
          </RevealFx>

          <RevealFx delay={0.6} fillWidth>
            <Flex className={styles.asideCard} direction="column" gap="12">
              <Text className={styles.sectionLabel}>Gallery</Text>
              <Grid columns={2} gap="8">
                {work.featuredProjects.slice(0, 4).map((project, i) => (
                  <SmartImage
                    key={i}
                    src={project.images[0]}
                    alt={project.name}
                    aspectRatio="1 / 1"
                    radius="m"
                  />
                ))}
              </Grid>
            </Flex>
          </RevealFx>
        </Grid>
      </Flex>

      <Line />

      <Flex as="section" fillWidth direction="column" gap="l" paddingY="xl">
        <Column gap="12">
          <Text className={styles.sectionLabel}>Architecture, Infrastructure & Quality</Text>
          <Heading as="h2" variant="display-strong-s">
            Building for scale and reliability.
          </Heading>
        </Column>
        <Grid columns={3} mobileColumns={1} gap="m">
          {about.capabilities.groups.map((group, i) => (
            <RevealFx key={group.title} delay={0.1 * i} fillWidth>
              <Flex className={styles.asideCard} direction="column" gap="16" fillWidth>
                <Text variant="heading-strong-m">{group.title}</Text>
                <Column as="ul" gap="8">
                  {group.items.map((item) => (
                    <Text as="li" key={item} variant="body-default-s" onBackground="neutral-weak">
                      {item}
                    </Text>
                  ))}
                </Column>
              </Flex>
            </RevealFx>
          ))}
        </Grid>
      </Flex>

      <Line />

      <Flex as="section" fillWidth direction="column" gap="l" paddingY="xl">
        <Column gap="12">
          <Text className={styles.sectionLabel}>Technical Stack</Text>
          <Heading as="h2" variant="display-strong-s">
            Tools of the trade.
          </Heading>
        </Column>
        <Grid columns={4} mobileColumns={2} gap="m">
          {about.technical.skills.map((skill, i) => (
            <RevealFx key={skill.title} delay={0.05 * i} fillWidth>
              <Flex className={styles.asideCard} direction="column" gap="12" fillWidth>
                <Text variant="label-strong-m" onBackground="neutral-strong">{skill.title}</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {skill.description}
                </Text>
              </Flex>
            </RevealFx>
          ))}
        </Grid>
      </Flex>

      <Line />

      <Flex as="footer" fillWidth direction="column" gap="l" paddingY="xl">
        <Flex fillWidth mobileDirection="column" gap="xl" vertical="center">
          <Column gap="12" flex={6}>
            <Text className={styles.sectionLabel}>Let's connect</Text>
            <Heading as="h2" variant="display-strong-s">
              Available for the right opportunity.
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {person.availability}
            </Text>
          </Column>
          <Column flex={4} gap="16">
            <Flex gap="12" wrap>
              <Button href={`mailto:${person.email}`} variant="primary" size="m" arrowIcon id="contact-email">
                Send an email
              </Button>
              <Button href="/about" variant="secondary" size="m">
                Read more about me
              </Button>
            </Flex>
            <Flex gap="12" wrap>
              {social.map((item) => (
                <Button key={item.name} href={item.link} variant="tertiary" size="s" prefixIcon={item.icon}>
                  {item.name}
                </Button>
              ))}
            </Flex>
          </Column>
        </Flex>
        <Line />
        <Flex fillWidth mobileDirection="column" gap="8" vertical="center" horizontal="space-between">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            &copy; {new Date().getFullYear()} {person.name}. All rights reserved.
          </Text>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {person.role} &middot; {person.location}
          </Text>
        </Flex>
      </Flex>

      <Line />
    </Column>
  );
}
