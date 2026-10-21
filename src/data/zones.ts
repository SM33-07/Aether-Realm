export type CrystalShape =
  | "torusKnot"
  | "icosahedron"
  | "dodecahedron"
  | "torus";

export type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  highlights?: string[];
  tags: string[];
  status?: "Production Live" | "Shipped" | "In Progress" | "Completed" | "Prototype";
  github?: string;
  demo?: string;
  isSecondary?: boolean;
};

export type SkillCategory = {
  category: string;
  skills: string[];
};

export type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  period: string;
};

export type ExperienceItem = {
  organization: string;
  role: string;
  period: string;
  isCurrent?: boolean;
  highlights: string[];
};

export type AdditionalContribution = {
  role: string;
  organization: string;
  period: string;
};

export type ContactLink = {
  label: string;
  url: string;
  description?: string;
};

export type ForgeContent = {
  type: "forge";
  featuredProjects: ProjectItem[];
  secondaryProjects?: ProjectItem[];
};

export type ArchivesContent = {
  type: "archives";
  categories: SkillCategory[];
};

export type OracleContent = {
  type: "oracle";
  bio: string;
  education: EducationItem;
  experiences: ExperienceItem[];
  additionalContributions: AdditionalContribution[];
  resume: string;
};

export type GatewayContent = {
  type: "gateway";
  contacts: ContactLink[];
};

export type ZoneContent =
  | ForgeContent
  | ArchivesContent
  | OracleContent
  | GatewayContent;

export type ZoneData = {
  id: string;
  name: string;
  lore: string;
  position: [number, number, number];
  color: string;
  shape: CrystalShape;
  content: ZoneContent;
};

export const ZONES: ZoneData[] = [
  {
    id: "the-forge",
    name: "The Forge",
    lore:
      "A molten chamber where engineering concepts are hammered into production software, developer tools, and interactive systems.",
    position: [6, 0, 4],
    color: "#f59e0b",
    shape: "torusKnot",

    content: {
      type: "forge",

      featuredProjects: [
        {
          title: "CodeVault",
          subtitle: "Self-hosted code snippet manager",
          description:
            "A self-hosted snippet platform that helps developers store, search, organize, and fork code. Built with Next.js, Express, PostgreSQL, and Prisma, with OAuth, visibility controls, analytics, AI-assisted explanations, and security-focused testing.",
          highlights: [
            "Architected layered service patterns separating Express controllers, services, and Prisma repositories.",
            "Implemented JWT authentication and Google/GitHub OAuth with fine-grained snippet visibility (public, private, unlisted).",
            "Built-in Gemini AI code explanations with graceful fallback, syntax highlighting, fork lineage tracking, and Docker smoke tests.",
            "Conducted security testing that identified and corrected an authorization flaw in ownership enforcement.",
          ],
          tags: [
            "Next.js",
            "Express.js",
            "PostgreSQL",
            "Prisma",
            "TypeScript",
            "Docker",
            "Gemini API",
            "JWT",
          ],
          status: "Shipped",
          github: "https://github.com/SM33-07/CodeVault",
          demo: "https://trycodevault.vercel.app/",
        },
        {
          title: "Code-e-Manipal 2.0",
          subtitle: "Hackathon management platform",
          description:
            "A full-stack hackathon management platform for participant registration, submissions, and event operations. I led its implementation across the frontend, integrations, and participant/admin workflows using Next.js, TypeScript, Supabase, and Azure-hosted PostgreSQL.",
          highlights: [
            "Independently designed, developed, and deployed the complete hackathon operations platform as Technical Lead.",
            "Engineered full participant and administrative workflows for multi-track registration, team submissions, and judging.",
            "Integrated Supabase authentication and session security with an Azure-hosted PostgreSQL database.",
            "Handled responsive interface development, deployment pipelines, and end-to-end integration debugging.",
          ],
          tags: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Supabase",
            "Azure PostgreSQL",
          ],
          status: "Completed",
          github: "https://github.com/SM33-07/code-e-manipal-2-demo",
          demo: "https://code-e-manipal-portal-demo.vercel.app",
        },
        {
          title: "Aether Realm",
          subtitle: "Interactive 3D developer portfolio",
          description:
            "An explorable 3D developer portfolio built with React Three Fiber and Three.js. Custom movement, interactive zones, dialogue, and persistent progression turn professional information into an experience visitors can explore.",
          highlights: [
            "Engineered custom avatar controller with 8-direction keyboard/joystick navigation and isometric camera tracking.",
            "Built 4 crystalline interactive zones with proximity triggers, spatial audio, dialogue systems, and cinematic camera transitions.",
            "Structured Zustand-powered state management to handle zone progression, audio state, and touch-accessible mobile controls.",
            "Optimized 3D rendering with procedural terrain, instanced vegetation, custom shaders, and responsive WebGL canvas scaling.",
          ],
          tags: [
            "Next.js",
            "React Three Fiber",
            "Three.js",
            "TypeScript",
            "Zustand",
            "Tailwind CSS",
          ],
          status: "Production Live",
          github: "https://github.com/SM33-07/Aether-Realm",
          demo: "https://aether-realm.vercel.app",
        },
        {
          title: "Operation Deadlight",
          subtitle: "Interactive cryptic-hunt experience",
          description:
            "An interactive investigation experience developed for CASCADE, combining case-file storytelling and puzzle-driven web interactions. I designed and built the experience from concept through deployment.",
          highlights: [
            "Designed and built the individual case-file puzzle experience from concept through production deployment for IEEE Computer Society MUJ.",
            "Created an immersive tactical case-file interface featuring animated transitions, terminal interactions, and responsive puzzles.",
            "Deployed as a headline puzzle experience within CASCADE, an interactive event engaging over 400 participants across 9 narrative timelines.",
          ],
          tags: [
            "React",
            "JavaScript",
            "Tailwind CSS",
            "GSAP",
            "Web Audio",
          ],
          status: "Shipped",
          github: "https://github.com/SM33-07/Operation-Deadlight",
          demo: "https://operation-deadlight.vercel.app",
        },
        {
          title: "RouteGuard",
          subtitle: "Graph-based routing and network resilience simulator",
          description:
            "An interactive graph-based routing and resilience simulator for exploring shortest-path algorithms, network connectivity, and network failures.",
          highlights: [
            "Compiled core graph algorithms (Dijkstra, BFS, A*, connectivity analysis) from ISO C11/C++ to WebAssembly via Emscripten.",
            "Built an interactive React 19 + Vite canvas interface for simulating dynamic network topology changes, latency, and node outages.",
            "Enables real-time visual inspection of algorithmic performance and network fault tolerance under adversarial partition scenarios.",
          ],
          tags: [
            "C/C++",
            "WebAssembly",
            "React",
            "TypeScript",
            "Vite",
            "Graph Algorithms",
          ],
          status: "Shipped",
          github: "https://github.com/SM33-07/RouteGuard",
          demo: "https://route-guard-dsa.vercel.app",
        },
        {
          title: "Corollary",
          subtitle: "PostgreSQL Query Performance Advisor",
          description:
            "Corollary is an in-progress PostgreSQL query-performance advisor focused on understanding costly execution patterns. Its development begins with workload statistics through pg_stat_statements, query-plan analysis with EXPLAIN, and a foundation for evidence-backed diagnostics.",
          highlights: [
            "Developing diagnostic analyzers for PostgreSQL query workloads utilizing pg_stat_statements metrics and EXPLAIN execution trees.",
            "Implementing query fingerprinting and structural categorization to isolate slow queries, sequential scans, and high-cost joins.",
            "Formulating rule-based diagnostic recommendations grounded in actual execution plan statistics without speculative advice.",
          ],
          tags: [
            "PostgreSQL",
            "TypeScript",
            "Node.js",
            "pg_stat_statements",
            "Query Optimization",
            "Database Internals",
          ],
          status: "In Progress",
          github: "https://github.com/SM33-07/Corollary",
        },
      ],

      secondaryProjects: [
        {
          title: "bookmark-manager-api",
          subtitle: "GraphQL Bookmark Management Service",
          description:
            "A high-performance GraphQL API built with Bun, GraphQL Yoga, Prisma, and PostgreSQL. Features cursor-based pagination, schema validation, and relational bookmark categorization.",
          tags: ["GraphQL", "Bun", "Prisma", "PostgreSQL", "TypeScript"],
          status: "Shipped",
          github: "https://github.com/SM33-07/bookmark-manager-api",
          isSecondary: true,
        },
        {
          title: "NexusFlow",
          subtitle: "Interactive workflow & node graph interface",
          description:
            "A dynamic, responsive workflow and node graph web application with interactive canvas manipulation, state tracking, and fluid transitions.",
          tags: ["React", "TypeScript", "Tailwind CSS", "Canvas"],
          status: "Shipped",
          github: "https://github.com/SM33-07/NexusFlow",
          demo: "https://nexus-flow-olive.vercel.app",
          isSecondary: true,
        },
        {
          title: "RRAS",
          subtitle: "Relief Routing Allocation System prototype",
          description:
            "An algorithmic resource allocation and routing prototype designed for disaster relief distribution, optimizing supply dispatch under network constraints.",
          tags: ["Python", "Algorithms", "Optimization", "Logistics"],
          status: "Prototype",
          github: "https://github.com/Soumya080/IIC",
          isSecondary: true,
        },
      ],
    },
  },

  {
    id: "the-archives",
    name: "The Archives",
    lore:
      "A structured repository of technical disciplines, languages, frameworks, and engineering practices.",
    position: [-5, 0, 8],
    color: "#06b6d4",
    shape: "icosahedron",

    content: {
      type: "archives",

      categories: [
        {
          category: "Languages",
          skills: [
            "TypeScript",
            "JavaScript",
            "Python",
            "C/C++",
            "HTML5 / CSS3",
            "SQL",
            "Java",
          ],
        },
        {
          category: "Frontend & Creative Development",
          skills: [
            "React",
            "Next.js",
            "Tailwind CSS",
            "Three.js",
            "React Three Fiber",
            "GSAP",
            "WebGL",
          ],
        },
        {
          category: "Backend & API Development",
          skills: [
            "Node.js",
            "Express.js",
            "Prisma ORM",
            "JWT Authentication",
            "OAuth 2.0",
            "Zod",
            "REST API Design",
            "GraphQL",
          ],
        },
        {
          category: "Databases & Performance",
          skills: [
            "PostgreSQL",
            "Supabase",
            "pg_stat_statements",
            "EXPLAIN Plan Diagnostics",
          ],
        },
        {
          category: "Infrastructure, Cloud & Tools",
          skills: [
            "Docker",
            "Git & GitHub",
            "GitHub Actions",
            "Microsoft Azure",
            "Google Cloud Platform",
            "Visual Studio Code",
            "WebAssembly (Emscripten)",
          ],
        },
        {
          category: "Engineering Practices",
          skills: [
            "Layered Service Architecture",
            "Sprint-Based Development",
            "Adversarial & Smoke Testing",
            "API-First Design",
            "Authorization & Ownership Controls",
            "Debugging & Production Deployment",
          ],
        },
      ],
    },
  },

  {
    id: "the-oracle",
    name: "The Oracle",
    lore:
      "A memory chronicle recording education, formal leadership roles, technical ownership, and career milestones.",
    position: [-8, 0, -6],
    color: "#8b5cf6",
    shape: "dodecahedron",

    content: {
      type: "oracle",

      bio:
        "I'm a Computer Science and Engineering student at Manipal University Jaipur who builds full-stack products, developer tools, and interactive web experiences.\n\nMy work spans TypeScript, React, Next.js, Node.js, Express, PostgreSQL, and Prisma, alongside creative development with Three.js and React Three Fiber.\n\nI've built a hackathon management platform, developed a self-hosted code snippet manager with security-focused access controls, and created interactive experiences ranging from puzzle-driven event websites to an explorable 3D portfolio.\n\nI'm particularly interested in backend engineering, secure application design, database performance, and building software that is reliable as well as engaging.",

      education: {
        degree: "Bachelor of Technology in Computer Science and Engineering",
        institution: "Manipal University Jaipur",
        location: "Jaipur, Rajasthan, India",
        period: "August 2025 – Present",
      },

      experiences: [
        {
          organization: "IEEE Computer Society MUJ",
          role: "Senior Coordinator, Technical Projects",
          period: "May 2026 – Present",
          isCurrent: true,
          highlights: [
            "Coordinate technical contributors and project sprint milestones across chapter initiatives.",
            "Designed and deployed an interactive case-file puzzle experience for CASCADE, an event engaging over 400 participants across 9 narrative timelines.",
            "Built Operation Deadlight from concept through production deployment as an individual case-file experience.",
            "Contributed to Chapter technical initiatives, including Genesis 6.0 planning and execution.",
          ],
        },
        {
          organization: "LearnIT Club, MUJ",
          role: "Senior Coordinator, Web Development",
          period: "May 2026 – Present",
          isCurrent: true,
          highlights: [
            "Coordinate web development workflows, contributor review pipelines, and technical standards.",
            "Led web development coordination associated with the flagship Code-e-Manipal platform.",
            "Developed the LearnIT Resources platform to curate learning materials for student developers.",
          ],
        },
        {
          organization: "Code-e-Manipal 2.0",
          role: "Technical Lead",
          period: "August 2026 – October 2026",
          isCurrent: false,
          highlights: [
            "Independently designed, developed, and deployed the complete hackathon operations platform.",
            "Built participant registration, team management, submission evaluation, and administrative dashboards.",
            "Integrated Supabase authentication and session security with an Azure-hosted PostgreSQL database.",
            "Handled frontend implementation, cross-service debugging, and production deployment.",
          ],
        },
      ],

      additionalContributions: [
        {
          role: "Technical Team — Junior Committee",
          organization: "IEEE Computer Society MUJ",
          period: "January 2026 – April 2026",
        },
        {
          role: "Web Development Junior Working Team",
          organization: "LearnIT Club, MUJ",
          period: "October 2025 – May 2026",
        },
        {
          role: "Technical Core Committee",
          organization: "IIC 3.0",
          period: "2026",
        },
        {
          role: "Design Team",
          organization: "HACKX 4.0",
          period: "2026",
        },
        {
          role: "Website Contributor",
          organization: "ICCIDFFS International Conference",
          period: "2026",
        },
      ],

      resume: "/resume.pdf",
    },
  },

  {
    id: "the-gateway",
    name: "The Gateway",
    lore:
      "A communications nexus for technical collaborations, engineering opportunities, and open-source discussions.",
    position: [9, 0, -8],
    color: "#ec4899",
    shape: "torus",

    content: {
      type: "gateway",

      contacts: [
        {
          label: "GitHub",
          url: "https://github.com/SM33-07",
          description: "Explore repositories, source code, and developer experiments",
        },
        {
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/soham-more-muj/",
          description: "Connect professionally and read technical journey updates",
        },
        {
          label: "Email",
          url: "mailto:sohammore3312@gmail.com",
          description: "Direct engineering inquiries, project discussions, and hiring",
        },
        {
          label: "X (Twitter)",
          url: "https://x.com/sohammore3312",
          description: "Follow build-in-public updates, thoughts, and tech discussions",
        },
      ],
    },
  },
];