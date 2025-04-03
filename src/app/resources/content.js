import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Emmanuel",
  lastName: "Agbedejobi",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Software Engineer",
  avatar: "/images/emma.JPG",
  location: "Africa/Lagos", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about software, life, and share thoughts on the intersection of
      creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/emmanuelsam34",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/emmanuel-samuel-agbedejobi/",
  },
  {
    name: "X",
    icon: "x",
    link: "https://x.com/emmanuelsam30",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:emmanuelagbedejobi@gmail.com",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Software Engineer</>,
  subline: (
    <>
      I'm Emmanuel Agbedejobi, a software engineer at <InlineCode>AmpliViral Digital Solutions</InlineCode>, where I craft intuitive
      <br /> web applications. I have a strong background in designing, developing, and optimizing scalable applications.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/emmanuel-agbedejobi",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Emmanuel is a software engineer with a passion for transforming complex challenges
        into simple, elegant technical solutions. His work spans digital interfaces, interactive
        experiences, and the convergence of design and technology.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "AmpliViral Digital Solutions",
        timeframe: "2023 - Present",
        role: "Software Engineer",
        achievements: [
          <>
            Developed and maintained scalable web applications using React, Next.js, and TypeScript.
          </>,
          <>
            Contributed to the development of a web application that allows users to manage their projects and tasks.
          </>,
          <>
            Built a project management tool for a client, using React, Next.js, and TypeScript.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
        ],
      },
      {
        company: "LIBL Academy",
        timeframe: "2018 - 2022",
        role: "Technical Lead",
        achievements: [
          <>
            Led the technical team in the development of an e-learning platform, using React, Next.js, and TypeScript.
          </>,
          <>
            Built a content management system for the platform, allowing the client to manage their content easily.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: false, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Jakarta",
        description: <>Studied software engineering.</>,
      },
      {
        name: "Build the Future",
        description: <>Studied online marketing and personal branding.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "React",
        description: <>Able to build scalable web applications using React, Next.js, and TypeScript.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
        ],
      },
      {
        title: "Next.js",
        description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
        ],
      },
      {
        title: "TypeScript",
        description: <>Able to build scalable web applications using TypeScript.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
        ],
      },
      {
        title: "Tailwind CSS",
        description: <>Able to build scalable web applications using Tailwind CSS.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
        ],
      },
    ],
  },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};



export { person, social, newsletter, home, about, blog, work };
