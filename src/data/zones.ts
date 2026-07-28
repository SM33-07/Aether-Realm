export type CrystalShape =
  | "torusKnot"
  | "icosahedron"
  | "dodecahedron"
  | "torus";

export type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
};

export type SkillCategory = {
  category: string;
  skills: string[];
};

export type ContactLink = {
  label: string;
  url: string;
  icon?: string;
};

export type ForgeContent = {
  type: "forge";
  projects: ProjectItem[];
};

export type ArchivesContent = {
  type: "archives";
  categories: SkillCategory[];
};

export type OracleContent = {
  type: "oracle";
  bio: string;
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
      "A molten chamber where concepts are transformed into full-stack software and interactive applications.",
    position: [6, 0, 4],
    color: "#f59e0b",
    shape: "torusKnot",

    content: {
      type: "forge",

      projects: [
        {
          title: "Code-E-Manipal Portal",
          description:
            "Official project submission and evaluation portal built for student coding challenges and tech events. Features automated assignment tracking, real-time submission workflows, project evaluation, and interactive event dashboards.",
          tags: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Supabase",
            "PostgreSQL",
          ],
          github: "https://github.com/SM33-07/Code-E-Manipal_Portal",
        },
        {
          title: "Operation Deadlight",
          description:
            "An intense tactical web application and interactive game system featuring real-time state management, custom animation pipelines, responsive keyboard controls, and high-performance game logic.",
          tags: [
            "JavaScript",
            "React",
            "Three.js",
            "Tailwind CSS",
            "Node.js",
          ],
          github: "https://github.com/SM33-07/Operation-Deadlight",
        },
        {
          title: "CodeVault",
          description:
            "A secure developer snippet & asset management platform. Features syntax-highlighted code storage, tag-based categorization, instant search, and encrypted cloud synchronization.",
          tags: [
            "React",
            "Next.js",
            "TypeScript",
            "Prisma",
            "PostgreSQL",
            "Tailwind CSS",
          ],
          github: "https://github.com/SM33-07/CodeVault",
        },
      ],
    },
  },

  {
    id: "the-archives",
    name: "The Archives",
    lore:
      "A sealed repository of technical mastery preserved within crystalline memory structures.",
    position: [-5, 0, 8],
    color: "#06b6d4",
    shape: "icosahedron",

    content: {
      type: "archives",

      categories: [
        {
          category: "Frontend",
          skills: [
            "HTML5",
            "Tailwind CSS",
            "JavaScript",
            "React",
            "TypeScript",
            "Next.js",
          ],
        },
        {
          category: "Backend & ORM",
          skills: [
            "Node.js",
            "Express.js",
            "Prisma ORM",
          ],
        },
        {
          category: "Database",
          skills: [
            "PostgreSQL",
            "Supabase",
          ],
        },
        {
          category: "Creative Dev & Animation",
          skills: [
            "Three.js",
            "React Three Fiber",
            "GSAP",
            "Framer Motion",
          ],
        },
        {
          category: "Tools & Deployment",
          skills: [
            "Vercel",
            "Git & GitHub",
            "VS Code",
          ],
        },
        {
          category: "Languages & Other",
          skills: [
            "C",
            "Prompt Engineering",
          ],
        },
      ],
    },
  },

  {
    id: "the-oracle",
    name: "The Oracle",
    lore:
      "An ancient intelligence that preserves memories, ambitions, and fragments of the creator's journey.",
    position: [-8, 0, -6],
    color: "#8b5cf6",
    shape: "dodecahedron",

    content: {
      type: "oracle",

      bio:
        "I'm Soham More, a Full-Stack & Creative Web Developer studying Information Technology at Manipal University Jaipur (MUJ).\n\nDriven by the craft of building fast, visually striking, and intuitive web applications, I combine modern full-stack architectures (Next.js, Node.js, PostgreSQL, Prisma, Supabase) with immersive 3D animation systems (Three.js, React Three Fiber, GSAP, Framer Motion).\n\nFrom architecting official event platforms like the Code-E-Manipal Portal to engineering game mechanics and interactive WebGL worlds, I focus on writing clean, scalable code and delivering unforgettable user experiences. Always exploring cutting-edge web tech, creative developer tools, and AI-assisted pair engineering.",

      resume: "/resume.pdf",
    },
  },

  {
    id: "the-gateway",
    name: "The Gateway",
    lore:
      "A dimensional nexus connecting distant worlds, collaborators, and future opportunities.",
    position: [9, 0, -8],
    color: "#ec4899",
    shape: "torus",

    content: {
      type: "gateway",

      contacts: [
        {
          label: "GitHub",
          url: "https://github.com/SM33-07",
        },
        {
          label: "LinkedIn",
          url: "https://linkedin.com/in/soham-more-muj",
        },
        {
          label: "X (Twitter)",
          url: "https://x.com/sohammore3312",
        },
        {
          label: "Email",
          url: "mailto:sohammore3312@gmail.com",
        },
      ],
    },
  },
];