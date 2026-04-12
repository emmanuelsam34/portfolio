"use client";

import { Column, Flex, Heading, SmartImage, SmartLink, Tag, Text } from "@/once-ui/components";

import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  description: string;
  summary?: string;
  platform?: string;
  status?: string;
  year?: string;
  stack?: string[];
  highlights?: string[];
  link?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority = false,
  images = [],
  title,
  description,
  summary,
  platform,
  status,
  year,
  stack = [],
  highlights = [],
  link,
}) => {
  const previewImage = images[0];
  const previewHighlights = highlights.slice(0, 3);
  const previewStack = stack.slice(0, 4);

  return (
    <Column className={styles.card} fillWidth gap="l">
      {previewImage && (
        <SmartImage
          priority={priority}
          className={styles.media}
          aspectRatio="16 / 10"
          radius="l"
          alt={title}
          src={previewImage}
        />
      )}
      <Flex fillWidth mobileDirection="column" gap="l" vertical="space-between">
        <Column flex={7} gap="16">
          <Flex gap="8" wrap vertical="center">
            {platform && (
              <Tag variant="neutral" size="s">
                {platform}
              </Tag>
            )}
            {status && (
              <Tag variant="brand" size="s">
                {status}
              </Tag>
            )}
            {year && (
              <Tag variant="accent" size="s">
                {year}
              </Tag>
            )}
          </Flex>
          <Column gap="12">
            <Heading as="h2" wrap="balance" variant="display-strong-xs">
              {title}
            </Heading>
            <Text variant="heading-default-s" onBackground="neutral-weak" wrap="balance">
              {description}
            </Text>
            {summary && (
              <Text variant="body-default-m" onBackground="neutral-medium" wrap="balance">
                {summary}
              </Text>
            )}
          </Column>
        </Column>
        <Column flex={5} gap="16">
          {previewHighlights.length > 0 && (
            <Column as="ul" gap="8" className={styles.list}>
              {previewHighlights.map((item) => (
                <Text as="li" key={item} variant="body-default-s" onBackground="neutral-strong">
                  {item}
                </Text>
              ))}
            </Column>
          )}
          {previewStack.length > 0 && (
            <Flex gap="8" wrap>
              {previewStack.map((item) => (
                <Tag key={item} variant="neutral" size="s">
                  {item}
                </Tag>
              ))}
            </Flex>
          )}
          <Flex gap="24" wrap>
            <SmartLink className={styles.link} suffixIcon="arrowRight" href={href}>
              <Text variant="body-default-s">Read case study</Text>
            </SmartLink>
            {link && (
              <SmartLink className={styles.link} suffixIcon="arrowUpRightFromSquare" href={link}>
                <Text variant="body-default-s">Open project link</Text>
              </SmartLink>
            )}
          </Flex>
        </Column>
      </Flex>
    </Column>
  );
};
