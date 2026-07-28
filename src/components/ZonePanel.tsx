"use client";

import { useGameStore } from "@/store/useGameStore";

import {
  ZONES,
  type ForgeContent,
  type ArchivesContent,
  type OracleContent,
  type GatewayContent,
} from "@/data/zones";

export default function ZonePanel() {
  const currentZone = useGameStore((s) => s.currentZone);
  const interactionPhase = useGameStore((s) => s.interactionPhase);
  const closeZoneContent = useGameStore((s) => s.closeZoneContent);

  const zone = ZONES.find((z) => z.id === currentZone);

  if (!zone || interactionPhase !== "content") {
    return null;
  }

  return (
    <div
      key={zone.id}
      style={{ animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
      className="
        absolute
        bottom-6
        left-1/2
        z-50
        w-[92vw]
        max-w-2xl
        max-h-[78vh]
        overflow-y-auto
        rounded-2xl
        border
        border-white/15
        bg-[#0b091a]/95
        p-6
        backdrop-blur-xl
        shadow-[0_10px_40px_rgba(0,0,0,0.8)]
        custom-scrollbar
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: zone.color }}
          />
          <div>
            <h2 className="text-xl font-bold font-mono tracking-wider text-white">
              {zone.name}
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{zone.lore}</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closeZoneContent}
          className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Content Renderers */}
      {zone.content.type === "forge" && (
        <ForgeContentComponent content={zone.content} />
      )}

      {zone.content.type === "archives" && (
        <ArchivesContentComponent content={zone.content} />
      )}

      {zone.content.type === "oracle" && (
        <OracleContentComponent content={zone.content} />
      )}

      {zone.content.type === "gateway" && (
        <GatewayContentComponent content={zone.content} />
      )}
    </div>
  );
}

/* ======================================
   Forge (Projects)
====================================== */

function ForgeContentComponent({ content }: { content: ForgeContent }) {
  return (
    <div className="space-y-4">
      {content.projects.map((project) => (
        <div
          key={project.title}
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-5
            hover:border-amber-500/40
            transition-all
          "
        >
          <h3 className="text-lg font-bold text-white font-mono">{project.title}</h3>

          <p className="mt-2 text-sm text-gray-300 leading-relaxed font-sans">
            {project.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="
                  rounded-md
                  bg-amber-500/10
                  border
                  border-amber-400/20
                  px-2.5
                  py-1
                  text-xs
                  font-mono
                  text-amber-200
                "
              >
                {tag}
              </span>
            ))}
          </div>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="
                pointer-events-auto
                mt-4
                inline-flex
                items-center
                gap-1.5
                text-sm
                font-mono
                text-amber-400
                hover:text-amber-300
                hover:underline
              "
            >
              <span>View Repository on GitHub</span>
              <span>→</span>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

/* ======================================
   Archives (Skills)
====================================== */

function ArchivesContentComponent({ content }: { content: ArchivesContent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {content.categories.map((category) => (
        <div
          key={category.category}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <h3 className="mb-2.5 text-sm font-bold font-mono tracking-wider text-cyan-300 uppercase">
            {category.category}
          </h3>

          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill}
                className="
                  rounded-md
                  bg-cyan-500/10
                  border
                  border-cyan-400/20
                  px-2.5
                  py-1
                  text-xs
                  font-mono
                  text-cyan-200
                "
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ======================================
   Oracle (Bio & Resume)
====================================== */

function OracleContentComponent({ content }: { content: OracleContent }) {
  const paragraphs = content.bio.split("\n\n");

  return (
    <div className="space-y-4">
      {paragraphs.map((p, idx) => (
        <p key={idx} className="text-sm leading-relaxed text-gray-300 font-sans">
          {p}
        </p>
      ))}

      <a
        href={content.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="
          pointer-events-auto
          mt-4
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-purple-500/20
          border
          border-purple-400/40
          px-4
          py-2.5
          text-sm
          font-mono
          font-medium
          text-purple-200
          hover:bg-purple-500/30
          hover:border-purple-400/70
          transition-all
        "
      >
        <span>📄 View Resume PDF</span>
      </a>
    </div>
  );
}

/* ======================================
   Gateway (2x2 Social Grid)
====================================== */

function PlatformLogo({ label }: { label: string }) {
  if (label.includes("GitHub")) {
    return (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  if (label.includes("LinkedIn")) {
    return (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    );
  }
  if (label.includes("X") || label.includes("Twitter")) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  // Email
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function GatewayContentComponent({ content }: { content: GatewayContent }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {content.contacts.map((contact) => (
        <a
          key={contact.label}
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            pointer-events-auto
            flex
            flex-col
            items-center
            justify-center
            p-5
            rounded-xl
            bg-white/5
            border
            border-white/10
            hover:border-pink-500/50
            hover:bg-pink-500/10
            transition-all
            duration-300
            group
            shadow-lg
          "
        >
          <div className="w-11 h-11 mb-2.5 rounded-full bg-pink-500/10 border border-pink-400/30 flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all shadow-[0_0_12px_rgba(236,72,153,0.2)]">
            <PlatformLogo label={contact.label} />
          </div>
          <span className="text-xs font-mono font-medium text-gray-200 group-hover:text-pink-300">
            {contact.label}
          </span>
        </a>
      ))}
    </div>
  );
}
