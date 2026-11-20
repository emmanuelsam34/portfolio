import Link from "next/link";

import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  index: number;
  total: number;
  priority?: boolean;
  images: string[];
  title: string;
  description: string;
  platform?: string;
  year?: string;
  stack?: string[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  index,
  total,
  priority = false,
  images = [],
  title,
  description,
  platform,
  year,
  stack = [],
}) => {
  const previewImage = images[0];

  return (
    <Link href={href} className={styles.card}>
      <div className={styles.frame}>
        {previewImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImage}
            alt=""
            loading={priority ? "eager" : "lazy"}
            className={styles.image}
          />
        )}
        <span className={styles.counter}>
          {pad(index + 1)}
          <small>/{pad(total)}</small>
        </span>
      </div>

      <div className={styles.body}>
        <span className={styles.meta}>
          {[platform, year].filter(Boolean).join(" · ")}
        </span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className="chips">
          {stack.slice(0, 4).map((item) => (
            <span key={item} className="chip chip-outline">
              {item}
            </span>
          ))}
        </div>
        <span className={styles.more}>
          Read the case study <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
};
