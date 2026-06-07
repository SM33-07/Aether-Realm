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
      "A molten chamber where forgotten constructs are reborn through code and creativity.",
    position: [6, 0, 4],
    color: "#f59e0b",
    shape: "torusKnot",

    content: {
      type: "forge",

      projects: [
        {
          title:
            "LearnIT Submission Portal",

          description:
            "Submission and evaluation portal built for handling project entries, workflow management, and streamlined event submissions.",

          tags: [
            "Next.js",
            "TypeScript",
            "Supabase",
            "PostgreSQL",
          ],

          github:
            "https://github.com/SM33-07/LearnIT-SubmissionPortal",
        },
      ],
    },
  },

  {
    id: "the-archives",
    name: "The Archives",
    lore:
      "A sealed repository of technical knowledge preserved within crystalline memory structures.",
    position: [-5, 0, 8],
    color: "#06b6d4",
    shape: "icosahedron",

    content: {
      type: "archives",

      categories: [
        {
          category: "Frontend",
          skills: [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
          ],
        },

        {
          category: "Backend",
          skills: [
            "Node.js",
            "Express",
            "Supabase",
            "PostgreSQL",
            "REST APIs",
          ],
        },

        {
          category:
            "3D & Creative Dev",

          skills: [
            "Three.js",
            "React Three Fiber",
            "GSAP",
            "Canvas API",
          ],
        },

        {
          category: "AI & ML",

          skills: [
            "OpenAI APIs",
            "Prompt Engineering",
            "Python",
            "ML Fundamentals",
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
        "I'm Soham More, a Computer Science student focused on building immersive digital experiences, scalable full-stack systems, and creative interactive interfaces.",

      resume:
        "/resume.pdf",
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
          url:
            "https://github.com/SM33-07",
        },

        {
          label: "LinkedIn",
          url:
            "https://linkedin.com/in/soham-more-muj",
        },

        {
          label: "Email",
          url:
            "mailto:sohammore3312@gmail.com",
        },

        {
          label: "X / Twitter",
          url:
            "https://x.com/sohammore3312",
        },
      ],
    },
  },
];