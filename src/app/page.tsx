import { HomeHero } from "@/components/home/HomeHero";
import { baseURL } from "@/app/resources";
import { home, person, work } from "@/app/resources/content";

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

export default function Home() {
  const shots = work.featuredProjects.map((p) => ({
    src: p.images[0].replace("w=1600", "w=480"),
    name: p.name,
  }));

  return (
    <>
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
      <HomeHero
        name={person.name}
        greeting={home.greeting}
        lead={home.heroLead}
        body={home.heroBody}
        avatar={person.avatar}
        avatarAlt={person.name}
        photoNote={home.photoCaption}
        shots={shots}
        nowLabel={home.nowLabel}
        nowTitle={home.nowTitle}
        workThumb={shots[0].src}
      />
    </>
  );
}
