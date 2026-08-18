const person = {
  firstName: "Emmanuel",
  lastName: "Agbedejobi",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Mobile, Platform & Infrastructure Engineer",
  tagline: "I design, ship, and operate connected products — from mobile apps to the infrastructure they run on.",
  avatar: "/images/emma.JPG",
  location: "Lagos, Nigeria",
  timeZone: "Africa/Lagos",
  availability: "Available for senior engineering roles, product teams, and contract builds.",
  email: "emmanuelagbedejobi@gmail.com",
};

const social = [
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

const featuredProjects = [
  {
    slug: "libl-classroom-tutor-app",
    name: "LIBL Classroom Tutor App",
    tagline: "Tutor operations, content creation, payouts, and live teaching in one mobile product.",
    summary:
      "A React Native and Expo tutor app for managing bookings, live sessions, AI-assisted coursework, earnings, and KYC readiness inside the LIBL classroom ecosystem.",
    platform: "Mobile Platform",
    status: "Active product",
    year: "2026",
    stack: ["Expo", "React Native", "TypeScript", "Appwrite", "Tamagui", "OpenRouter", "Paystack", "BigBlueButton"],
    responsibilities: [
      "Built mobile product flows for tutor onboarding, booking management, messaging, payouts, and session operations.",
      "Worked across Appwrite-backed services and integrations for notifications, payment flows, AI features, and verification.",
      "Shaped a product experience that connected tutor workflows to the wider LIBL admin and student platform.",
    ],
    highlights: [
      "AI-assisted quiz and assignment generation",
      "BigBlueButton live class sessions",
      "Push notifications and session reminders",
      "Payout and verification readiness",
    ],
    repoPathLabel: "LIBL-Classroom-Tutor-App/LIBL-Classroom-tutor-app",
    images: ["https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1600&auto=format&fit=crop"],
  },
  {
    slug: "libl-classroom-student-app",
    name: "LIBL Classroom Student App",
    tagline: "A mobile booking and learning product for finding tutors, negotiating rates, and attending classes.",
    summary:
      "A student-facing mobile app for tutor discovery, booking, negotiation, payments, chat, and virtual classroom access within the LIBL tutoring platform.",
    platform: "Mobile Platform",
    status: "Active product",
    year: "2026",
    stack: ["Expo", "React Native", "TypeScript", "Appwrite", "Tamagui", "React Query", "Paystack", "BigBlueButton"],
    responsibilities: [
      "Implemented multi-step booking and class management experiences for students across virtual and physical tutoring flows.",
      "Integrated payments, scheduling, messaging, and notification touchpoints with the shared platform backend.",
      "Helped shape the connected user journey between tutor discovery, negotiation, and session participation.",
    ],
    highlights: [
      "Multi-step booking flow",
      "Tutor matching and negotiation",
      "Integrated payments and invoicing",
      "Chat and session management",
    ],
    repoPathLabel: "Student-App-LIBL-Classroom/LIBL-Classroom-student-app",
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"],
  },
  {
    slug: "libl-classroom-admin-dashboard",
    name: "LIBL Classroom Admin Dashboard",
    tagline: "An internal control center for the marketplace behind the LIBL tutoring ecosystem.",
    summary:
      "A React and Vite admin dashboard for overseeing users, KYC reviews, bookings, financial workflows, and operational content across the LIBL platform.",
    platform: "Web Platform",
    status: "Operational dashboard",
    year: "2026",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "shadcn/ui", "Appwrite", "TanStack Query", "Recharts"],
    responsibilities: [
      "Built internal product tooling for managing tutors, students, bookings, verification states, and operational reporting.",
      "Worked on admin-facing workflows that connect directly to the mobile products and shared platform data.",
      "Helped define the platform layer required to run the tutoring marketplace reliably.",
    ],
    highlights: [
      "KPI and platform health dashboards",
      "User and session administration",
      "KYC review workflows",
      "Financial operations and payouts",
    ],
    repoPathLabel: "libl-classroom-admin",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop"],
  },
  {
    slug: "libl-online-school-enrollment-portal",
    name: "LIBL Online School Enrollment Portal",
    tagline: "End-to-end enrollment, Paystack settlement, soft-proctored placement exams, and automated admissions.",
    summary:
      "A full-stack enrollment platform featuring a hexagonal architecture monorepo, in-browser multi-modal soft proctoring (audio, vision, behavior, network) with Web Worker heartbeats, idempotent Paystack payment processing, and stateless on-demand PDF admission letters.",
    platform: "Web Platform",
    status: "Active platform",
    year: "2026",
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Node.js",
      "Appwrite",
      "Paystack",
      "MediaPipe (WASM)",
      "Web Workers",
      "pdf-lib",
      "Vercel",
    ],
    responsibilities: [
      "Architected a strict hexagonal monorepo isolating pure domain logic (@libl/core) from infrastructure adapters and cloud dependencies.",
      "Engineered an in-browser soft-proctoring pipeline fusing 4 detection engines (MediaPipe face tracking, acoustic speech analysis, DOM/tab heuristics, network probing) with a Web Worker clock.",
      "Implemented a server-authoritative penalty mechanism with dynamic question bank reshuffling and server-side scoring.",
      "Designed idempotent Paystack payment routines with HMAC-SHA512 verification, regional catchment fee tiering, and dynamic PDF letter generation via pdf-lib.",
    ],
    highlights: [
      "Hexagonal domain-driven monorepo (@libl/core, infra, api)",
      "4-engine soft proctoring with Web Worker background sampling",
      "Idempotent payment settlement with raw HMAC-SHA512 validation",
      "Stateless on-demand PDF admission letter generation",
      "Catchment-based fee tiering with immutable offer freezing",
    ],
    repoPathLabel: "LIBL Online School Enrollment Portal",
    images: ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1600&auto=format&fit=crop"],
  },
  {
    slug: "libl-classroom-desktop",
    name: "LIBL Classroom Desktop App",
    tagline: "A cross-platform Electron app that brings LIBL's live virtual classes to the desktop.",
    summary:
      "An isolated Electron desktop app for students and tutors to check in and join live BigBlueButton classes from macOS and Windows, talking to the same Appwrite backend as the mobile apps and packaged for distribution via CI.",
    platform: "Desktop Platform",
    status: "Active product",
    year: "2026",
    stack: ["Electron", "Vite", "TypeScript", "Appwrite", "BigBlueButton", "GitHub Actions"],
    responsibilities: [
      "Built a standalone desktop client outside the Expo/EAS pipeline that reuses the shared Appwrite backend for auth, sessions, and class data.",
      "Implemented time-windowed class check-in enforced in the Africa/Lagos timezone and embedded BBB join via an Electron webview with a browser fallback.",
      "Set up cross-platform packaging and a tag-triggered GitHub Actions workflow to produce signed-optional macOS and Windows installers for testers.",
    ],
    highlights: [
      "Shared Appwrite backend with the mobile apps",
      "30-minute check-in window enforcement",
      "Embedded BBB join via Electron webview",
      "CI-built macOS and Windows installers",
    ],
    repoPathLabel: "libl-classroom-desktop",
    images: ["https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=1600&auto=format&fit=crop"],
  },
  {
    slug: "kyc-verification-portal",
    name: "KYC Verification Portal",
    tagline: "A verification orchestration layer for secure tutor onboarding and compliance.",
    summary:
      "A KYC portal that integrates Didit hosted flows, Appwrite persistence, signed verification tokens, and webhook-driven status updates for tutor verification.",
    platform: "Compliance System",
    status: "Production-oriented workflow",
    year: "2026",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Appwrite", "Didit", "Resend", "Vercel Functions"],
    responsibilities: [
      "Reworked the verification experience around a hosted KYC provider instead of a fragile custom LLM-only flow.",
      "Implemented secure session creation, webhook verification, and tutor status lifecycle management.",
      "Focused on reliability, compliance-minded architecture, and a lower-friction verification journey.",
    ],
    highlights: [
      "Hosted KYC session orchestration",
      "Signed token validation",
      "Webhook integrity with HMAC verification",
      "Status tracking and notification flows",
    ],
    repoPathLabel: "kyc-verification-portal",
    images: ["https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop"],
  },
  {
    slug: "bbb-live-class-infrastructure",
    name: "Live-Class Infrastructure (BigBlueButton)",
    tagline: "Self-hosted conferencing infrastructure powering live 1:1 virtual classes for the LIBL platform.",
    summary:
      "Architecture, deployment, and operation of a self-hosted BigBlueButton deployment for live tutoring classes: an intent-versus-action booking design, cost-driven provider selection, real incident response, and a Datadog observability build-out.",
    platform: "Infrastructure",
    status: "Live in production",
    year: "2026",
    stack: ["BigBlueButton 3.0", "Ubuntu 22.04", "nginx", "haproxy", "Docker", "Appwrite Functions", "Datadog", "Let's Encrypt"],
    responsibilities: [
      "Designed the live-class architecture: ephemeral-meeting handling via check-in gated creation, server-time enforcement, idempotent state transitions, and a server abstraction ready for load balancing.",
      "Evaluated cloud providers on cost, latency to Lagos, and CPU guarantees, then deployed BBB to production with a phased, pre-flight-driven runbook.",
      "Diagnosed and resolved a production 502 outage, then hardened the system with systemd overrides, SSH key auth, and a full Datadog observability stack.",
    ],
    highlights: [
      "Intent vs. action booking architecture",
      "Root-caused a masked haproxy failure",
      "Synthetic, process, and SSL monitoring",
      "Custom BBB metrics via OpenMetrics exporter",
    ],
    images: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop"],
  },
  {
    slug: "enterprise-digital-appraisal-system",
    name: "Enterprise Digital Appraisal System",
    tagline: "An automated, auditable performance appraisal workflow engine on ERPNext and Frappe.",
    summary:
      "A complete digital transformation of an enterprise quarterly performance appraisal system on Frappe/ERPNext: weighted ceiling scoring, multi-tier digital signatures with snapshot declarations, actor-scoped state machines, and complete audit logging under strict zero-CLI constraints.",
    platform: "ERP & Workflow System",
    status: "Production design & build",
    year: "2026",
    stack: [
      "Frappe Framework",
      "ERPNext",
      "Python (Server Scripts)",
      "JavaScript",
      "DocType Workflows",
      "REST APIs",
      "Notification Engine",
    ],
    responsibilities: [
      "Architected the 7-state appraisal lifecycle workflow separating state machines, Python validation rules, event-driven alerts, and presentation layers.",
      "Engineered dynamic actor-scoping rules combining flat Frappe roles with record-level manager hierarchy validation.",
      "Built 'weight-as-ceiling' scoring models with independent self-scoring, manager scoring, and attributable per-KPA disciplinary deductions.",
      "Implemented legally defensible 3-tier digital signatures with immutable declaration text snapshotting.",
      "Designed automated objective carry-forward mechanisms seeding subsequent appraisal cycles.",
    ],
    highlights: [
      "7-state role & actor-scoped appraisal workflow",
      "Weight-as-ceiling dual scoring with attributable deductions",
      "3-tier digital signatures with immutable declaration snapshots",
      "Automated objective carry-forward to next-quarter cycles",
      "100% UI/API delivery within zero-CLI constraints",
    ],
    images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop"],
  },
  // Eleglam Cakes entry temporarily hidden from the work section and homepage.
  // Uncomment this block to restore it (the case study MDX at
  // src/app/work/projects/eleglam-cakes.mdx is left in place).
  /*
  {
    slug: "eleglam-cakes",
    name: "Eleglam Cakes Website",
    tagline: "A bespoke, photo-led marketing site for a made-to-order bakery in Rockwall, Texas.",
    summary:
      "An end-to-end design and build for Eleglam Cakes: a custom brand system, hand-built sliders, a filterable gallery with lightbox, and a no-backend order builder, all shipped into a live WordPress and Astra environment with zero paid plugins.",
    platform: "Client Website",
    status: "Shipped client build",
    year: "2026",
    stack: ["WordPress", "Astra", "Gutenberg", "HTML", "CSS", "Tailwind (CDN)", "JavaScript"],
    responsibilities: [
      "Rebuilt an inherited corporate template into a brand-appropriate site for an artisan bakery, from design tokens to page structure.",
      "Built custom, dependency-light components: hero slider, draggable card rails, filterable gallery, keyboard-accessible lightbox, and an order builder that works with no backend.",
      "Solved real WordPress and Astra environment issues so bespoke front-end shipped cleanly through Gutenberg without paid plugins.",
    ],
    highlights: [
      "Custom design system and brand palette",
      "Filterable gallery with accessible lightbox",
      "No-backend order builder with live summary",
      "Full-bleed layouts inside a constrained theme",
    ],
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1600&auto=format&fit=crop"],
  },
  */
];

const featuredProjectSlugs = featuredProjects.map((project) => project.slug);

const home = {
  label: "Home",
  title: `${person.name} | ${person.role}`,
  description:
    "Portfolio of Emmanuel Agbedejobi, a mobile, platform, and infrastructure engineer building connected products across React Native, web platforms, backend integrations, payments, verification systems, and self-hosted infrastructure.",
  eyebrow: "Mobile, platform, and infrastructure systems",
  headline: "I build and operate products, from mobile apps to infrastructure.",
  intro:
    "React Native apps, platform dashboards, integrations, and the infrastructure that keeps them running.",
  subline:
    "My recent work spans the LIBL education ecosystem — including its online school enrollment portal, mobile tutoring apps, and self-hosted live-class infrastructure — alongside verification workflows and client builds, combining frontend craft with backend domain architecture and distributed systems.",
  primaryCta: {
    label: "View selected work",
    href: "/work",
  },
  secondaryCta: {
    label: "About Emmanuel",
    href: "/about",
  },
  specialties: [
    "React Native and Expo product development",
    "Self-hosted infrastructure, deployment, and observability",
    "QA Engineering and automated testing systems",
    "System Architecture and platform design",
    "Payments, verification, and workflow integrations",
  ],
  credibility: [
    "Built connected products across tutor, student, admin, and verification surfaces",
    "Deploys and operates production infrastructure with monitoring, incident response, and postmortem-driven hardening",
    "Works comfortably across React, Next.js, Vite, Expo, and TypeScript",
    "Strong focus on usable product systems rather than isolated feature builds",
  ],
};

const about = {
  label: "About",
  title: "About Emmanuel",
  description:
    "Mobile, platform, and infrastructure engineer focused on building reliable product systems, internal tools, customer-facing experiences, and the infrastructure that runs them.",
  calendar: {
    display: true,
    link: "https://cal.com/emmanuel-agbedejobi",
    label: "Schedule a conversation",
  },
  intro: {
    display: true,
    title: "Introduction",
    description:
      "I’m a software engineer with a product mindset whose work has grown to span platform and infrastructure engineering. I enjoy working where customer-facing experience meets platform complexity, building the interfaces, workflows, integrations, and infrastructure that make software feel coherent at scale.",
  },
  profile: [
    "I’m most effective on products that span multiple surfaces, especially when mobile apps, dashboards, and backend workflows all need to behave like one system.",
    "My recent work has focused on tutoring and verification products where scheduling, communication, payments, KYC, and internal operations all intersect.",
    "That range now extends below the application layer: I design, deploy, and operate production infrastructure — including the self-hosted live-class conferencing stack behind the LIBL platform — with observability, incident response, and postmortem-driven hardening as part of the day-to-day work.",
  ],
  work: {
    display: true,
    title: "Experience",
    experiences: [
      {
        company: "AmpliViral Digital Solutions",
        timeframe: "2023 - Present",
        role: "Software Engineer",
        achievements: [
          "Built and maintained web products with React, Next.js, TypeScript, and supporting backend integrations.",
          "Delivered client-facing product flows and internal tooling with a focus on maintainability and operational clarity.",
          "Worked across feature delivery, interface design, and platform-level problem solving.",
        ],
      },
      {
        company: "LIBL Academy",
        timeframe: "2018 - 2022",
        role: "Technical Lead",
        achievements: [
          "Led technical execution for an e-learning platform and its supporting internal systems.",
          "Helped shape product direction across content management, user workflows, and platform delivery.",
          "Built the foundation for connected tutoring experiences across multiple user roles.",
        ],
      },
    ],
  },
  capabilities: {
    display: true,
    title: "Capabilities",
    groups: [
      {
        title: "Mobile product engineering",
        items: [
          "Expo and React Native application architecture",
          "Booking, messaging, onboarding, and real-time product flows",
          "Push notifications, payments, and session lifecycle support",
        ],
      },
      {
        title: "Platform and internal tools",
        items: [
          "Operational dashboards for marketplace teams",
          "Admin workflows for KYC, bookings, users, and financial actions",
          "Data-aware UI systems built for daily internal use",
        ],
      },
      {
        title: "Infrastructure and reliability",
        items: [
          "Self-hosted infrastructure deployment and operations (Linux, nginx, haproxy, Docker)",
          "Observability, incident response, and postmortem-driven hardening",
          "End-to-end automated testing and scalable system architecture",
        ],
      },
    ],
  },
  technical: {
    display: true,
    title: "Core stack",
    skills: [
      {
        title: "Frontend",
        description: "React, Next.js, Vite, TypeScript, Tailwind CSS, shadcn/ui, Once UI",
      },
      {
        title: "Mobile",
        description: "Expo, React Native, Expo Router, Tamagui, mobile state and data flows",
      },
      {
        title: "Platform & Infra",
        description: "Appwrite, Frappe / ERPNext, serverless functions, webhook workflows, Linux, nginx, haproxy, Docker, BigBlueButton, Datadog",
      },
      {
        title: "Integrations",
        description: "Paystack, BigBlueButton, Didit, Resend, OpenRouter, Google Gemini",
      },
    ],
  },
  contact: {
    title: "Availability",
    description: person.availability,
  },
};

const blog = {
  label: "Blog",
  title: "Writing",
  description: "Writing is currently hidden from the primary portfolio experience.",
};

const work = {
  label: "Work",
  title: "Selected Work",
  description:
    "Case studies across mobile products, internal platform tooling, verification workflows, and client website builds.",
  intro:
    "These projects show how I work across product surfaces, from customer-facing mobile experiences and client websites to the dashboards and integrations that support them behind the scenes.",
  featuredProjects,
  featuredProjectSlugs,
};

const newsletter = {
  display: false,
  title: "Newsletter",
  description: "Newsletter is disabled for this portfolio experience.",
};

export { person, social, newsletter, home, about, blog, work, featuredProjects };
