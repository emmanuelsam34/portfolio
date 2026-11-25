import { Reveal } from "@/components/Reveal";

import styles from "./Services.module.scss";

interface ServiceGroup {
  title: string;
  label: string;
  items: { name: string; detail: string }[];
}

interface ServicesProps {
  eyebrow: string;
  title: string;
  note?: string;
  groups: ServiceGroup[];
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Two numbered columns of services, with a handwritten note. Used on Work and About. */
export function Services({ eyebrow, title, note, groups }: ServicesProps) {
  let n = 0;
  return (
    <section className={styles.svc}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
        <h2 data-split className="display display-l">
          {title}
        </h2>
      </Reveal>
      {note && (
        <span className={`hand ${styles.svcNote}`} aria-hidden="true">
          {note}
          <svg viewBox="0 0 90 60" className="scribble">
            <path d="M84 6 C 60 4, 30 14, 14 46 M14 46 L 10 30 M14 46 L 30 42" />
          </svg>
        </span>
      )}
      <div className={styles.svcCols}>
        {groups.map((g, gi) => (
          <Reveal key={g.title} delay={gi * 0.1} className={styles.svcGroup}>
            <h3>
              {g.title}
              <small>{g.label}</small>
            </h3>
            {g.items.map((item) => (
              <div key={item.name} className={styles.svcRow}>
                <i>{pad(++n)}</i>
                <b>{item.name}</b>
                <span>{item.detail}</span>
              </div>
            ))}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
