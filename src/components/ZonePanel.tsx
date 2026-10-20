"use client";

import { ZONES, ForgeContent, ArchivesContent, OracleContent, GatewayContent } from "@/data/zones";
import { useGameStore } from "@/store/useGameStore";
import { playSfx } from "@/lib/audioManager";

export default function ZonePanel() {
  const currentZone = useGameStore((state) => state.currentZone);
  const interactionPhase = useGameStore((state) => state.interactionPhase);
  const closeZoneContent = useGameStore((state) => state.closeZoneContent);

  const zone = ZONES.find((item) => item.id === currentZone);

  if (interactionPhase !== "content" || !zone) return null;

  const handleClose = () => {
    playSfx("close");
    closeZoneContent();
  };

  return (
    <div
      key={zone.id}
      style={{ animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
      className="
        fixed
        bottom-[calc(env(safe-area-inset-bottom,0px)+0.75rem)]
        left-1/2
        -translate-x-1/2
        z-50
        w-[calc(100vw-1.5rem)]
        sm:w-[92vw]
        max-w-2xl
        max-h-[calc(100dvh-5.5rem)]
        overflow-y-auto
        overscroll-contain
        rounded-2xl
        border border-white/15
        bg-[#0b091a]/95
        p-4 sm:p-6
        backdrop-blur-xl
        shadow-[0_10px_40px_rgba(0,0,0,0.85)]
        custom-scrollbar
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span
            className="w-3 h-3 rounded-full shrink-0 animate-pulse"
            style={{ backgroundColor: zone.color }}
          />
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-bold font-mono tracking-wider text-white truncate">
              {zone.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 font-mono mt-0.5 line-clamp-1">
              {zone.lore}
            </p>
          </div>
        </div>

        {/* Close Button - Minimum 44x44px for touch accessibility */}
        <button
          onClick={handleClose}
          className="pointer-events-auto flex shrink-0 items-center justify-center w-11 h-11 sm:w-9 sm:h-9 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition active:scale-95 touch-manipulation"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Dynamic Content */}
      <div className="text-gray-300">
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
    </div>
  );
}

/* ======================================
   Forge (Projects)
====================================== */

function ForgeContentComponent({ content }: { content: ForgeContent }) {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      {content.projects.map((proj) => (
        <div
          key={proj.title}
          className="
            group
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-3.5 sm:p-5
            hover:border-amber-500/40
            hover:bg-white/[0.07]
            transition-all
          "
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5 sm:mb-2">
            <h3 className="text-sm sm:text-base font-bold font-mono text-white group-hover:text-amber-300 transition-colors">
              {proj.title}
            </h3>
            <div className="flex items-center gap-3 text-xs font-mono">
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto text-amber-400/80 hover:text-amber-300 hover:underline touch-manipulation py-1"
                >
                  GitHub ↗
                </a>
              )}
              {proj.demo && (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto text-purple-400 hover:text-purple-300 hover:underline touch-manipulation py-1"
                >
                  Live ↗
                </a>
              )}
            </div>
          </div>

          <p className="mb-3 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
            {proj.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {proj.tags.map((tag) => (
              <span
                key={tag}
                className="
                  rounded-md
                  border
                  border-amber-500/20
                  bg-amber-500/10
                  px-2
                  py-0.5
                  text-[10px] sm:text-[11px]
                  font-mono
                  text-amber-200
                "
              >
                {tag}
              </span>
            ))}
          </div>
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
    <div className="space-y-3.5 sm:space-y-4">
      {content.categories.map((category) => (
        <div
          key={category.category}
          className="rounded-xl border border-white/10 bg-white/5 p-3.5 sm:p-4"
        >
          <h3 className="mb-2 text-xs sm:text-sm font-bold font-mono tracking-wider text-cyan-300 uppercase">
            {category.category}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill}
                className="
                  rounded-lg
                  border
                  border-cyan-400/20
                  bg-cyan-500/10
                  px-2.5
                  py-1
                  text-[11px] sm:text-xs
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
        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-gray-300 font-sans">
          {p}
        </p>
      ))}

      {/* Target points to verified public/resume.pdf */}
      <a
        href={content.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="
          pointer-events-auto
          mt-3
          inline-flex
          min-h-[44px]
          items-center
          gap-2.5
          rounded-xl
          bg-purple-500/20
          border
          border-purple-400/40
          px-4
          py-2.5
          text-xs sm:text-sm
          font-mono
          font-semibold
          text-purple-200
          hover:bg-purple-500/30
          hover:border-purple-400/70
          transition-all
          active:scale-95
          touch-manipulation
        "
      >
        <span>📄 View Resume PDF</span>
      </a>
    </div>
  );
}

/* ======================================
   Gateway (Social Links Grid)
====================================== */

function PlatformLogo({ label }: { label: string }) {
  if (label.includes("GitHub")) {
    return (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  if (label.includes("LinkedIn")) {
    return (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    );
  }
  if (label.includes("X") || label.includes("Twitter")) {
    return (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function GatewayContentComponent({ content }: { content: GatewayContent }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-2">
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
            p-3 sm:p-5
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
            active:scale-95
            touch-manipulation
          "
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 mb-2 rounded-full bg-pink-500/10 border border-pink-400/30 flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all shadow-[0_0_12px_rgba(236,72,153,0.2)]">
            <PlatformLogo label={contact.label} />
          </div>
          <span className="text-xs font-mono font-medium text-gray-200 group-hover:text-pink-300 text-center truncate w-full px-1">
            {contact.label}
          </span>
        </a>
      ))}
    </div>
  );
}
