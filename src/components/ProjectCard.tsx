"use client";

import { Column, Flex, Heading, RevealFx, SmartImage, SmartLink, Tag, Text, TiltFx } from "@/once-ui/components";

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
    <Column className={styles.card} fillWidth gap="m">
      <SmartLink href={href} fillWidth>
        <TiltFx flex={1}>
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
        </TiltFx>
      </SmartLink>
        <Column fillWidth gap="8">
          <Flex fillWidth horizontal="space-between" vertical="center">
            <Text variant="heading-strong-l">{title}</Text>
            {platform && (
              <Tag variant="neutral" size="s">
                {platform}
              </Tag>
            )}
          </Flex>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {description}
          </Text>
        </Column>
    </Column>
  );
};
