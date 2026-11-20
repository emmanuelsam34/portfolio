import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";
import "./theme.scss";

import classNames from "classnames";
import { Caveat, Figtree, Fraunces, Source_Code_Pro } from "next/font/google";

import { Footer, Header, RouteGuard } from "@/components";
import { baseURL, style } from "@/app/resources";
import { person, home } from "@/app/resources/content";

export async function generateMetadata() {
  return {
    metadataBase: new URL(`https://${baseURL}`),
    title: home.title,
    description: home.description,
    openGraph: {
      title: home.title,
      description: home.description,
      url: baseURL,
      siteName: person.name,
      locale: "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const primary = Figtree({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const secondary = Fraunces({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

const tertiary = Caveat({
  variable: "--font-tertiary",
  subsets: ["latin"],
  display: "swap",
  weight: ["700"],
});

const code = Source_Code_Pro({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-theme={style.theme}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(primary.variable, secondary.variable, tertiary.variable, code.variable)}
    >
      <body>
        <Header />
        <main style={{ flex: 1, position: "relative" }}>
          <RouteGuard>{children}</RouteGuard>
        </main>
        <Footer />
      </body>
    </html>
  );
}
