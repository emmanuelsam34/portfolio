import { person, social } from "@/app/resources/content";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>
        <div className={styles.cta}>
          <span className={styles.eyebrow}>Let&apos;s build something</span>
          <h2 className={styles.title}>
            Got a product that
            <br />
            needs to <em>hold up?</em>
          </h2>
          <p className={styles.copy}>{person.availability}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={`mailto:${person.email}`}>
              {person.email}
            </a>
            <span className={styles.note}>I reply faster than my CI runs</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {currentYear} {person.name} · {person.location}
          </span>
          <ul className={styles.social}>
            {social
              .filter((item) => item.link && !item.link.startsWith("mailto:"))
              .map((item) => (
                <li key={item.name}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
