"use client";

import { useState } from "react";
import {
  ZONES,
  ForgeContent,
  ArchivesContent,
  OracleContent,
  GatewayContent,
  ProjectItem,
} from "@/data/zones";
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
        inset-x-0
        mx-auto
        z-50
        w-[calc(100vw-1.25rem)]
        sm:w-[92vw]
        max-w-3xl
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
   Forge (Featured & Curated Projects)
====================================== */

function StatusBadge({ status }: { status?: ProjectItem["status"] }) {
  if (!status) return null;

  if (status === "Production Live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-emerald-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live
      </span>
    );
  }
  if (status === "In Progress") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-amber-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        In Progress
      </span>
    );
  }
  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-indigo-300">
        Completed
      </span>
    );
  }
  if (status === "Prototype") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-purple-300">
        Prototype
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-mono text-cyan-300">
      Shipped
    </span>
  );
}

function ProjectCard({ proj }: { proj: ProjectItem }) {
  return (
    <div
      className="
        group
        rounded-xl
        border
        border-white/10
        bg-white/[0.04]
        p-4 sm:p-5
        hover:border-amber-500/40
        hover:bg-white/[0.07]
        transition-all
        duration-200
      "
    >
      {/* Title + Subtitle + Actions */}
      <div className="flex flex-wrap items-start justify-between gap-2.5 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold font-mono text-white group-hover:text-amber-300 transition-colors">
              {proj.title}
            </h3>
            <StatusBadge status={proj.status} />
          </div>
          {proj.subtitle && (
            <p className="text-xs sm:text-[13px] text-amber-200/80 font-mono mt-0.5">
              {proj.subtitle}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono shrink-0">
          {proj.github && (
            <a
              href={proj.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all touch-manipulation"
            >
              <span>GitHub</span>
              <span className="text-[10px]">↗</span>
            </a>
          )}
          {proj.demo && (
            <a
              href={proj.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-400/30 text-purple-300 hover:text-purple-200 hover:border-purple-400/60 hover:bg-purple-500/25 transition-all touch-manipulation"
            >
              <span>Live Demo</span>
              <span className="text-[10px]">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
        {proj.description}
      </p>

      {/* Engineering Highlights */}
      {proj.highlights && proj.highlights.length > 0 && (
        <div className="mb-3.5 space-y-1.5 rounded-lg bg-black/30 border border-white/5 p-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Key Technical Implementations:
          </div>
          <ul className="space-y-1 text-xs text-gray-300/90 font-sans">
            {proj.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400/80 text-[11px] leading-tight mt-0.5 shrink-0">
                  ✦
                </span>
                <span className="leading-snug">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Tags */}
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
  );
}

function ForgeContentComponent({ content }: { content: ForgeContent }) {
  const [showSecondary, setShowSecondary] = useState(false);

  return (
    <div className="space-y-4">
      {/* Featured Projects Header */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
          Featured Engineering Work ({content.featuredProjects.length})
        </span>
      </div>

      {/* Primary Project Cards */}
      <div className="space-y-3.5 sm:space-y-4">
        {content.featuredProjects.map((proj) => (
          <ProjectCard key={proj.title} proj={proj} />
        ))}
      </div>

      {/* Curated Secondary Work Accordion / Toggle */}
      {content.secondaryProjects && content.secondaryProjects.length > 0 && (
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={() => setShowSecondary((prev) => !prev)}
            className="
              pointer-events-auto
              w-full
              flex
              items-center
              justify-between
              p-3
              rounded-xl
              bg-white/[0.03]
              border
              border-white/10
              hover:bg-white/[0.07]
              hover:border-amber-500/30
              transition-all
              font-mono
              text-xs
              text-gray-300
              touch-manipulation
            "
          >
            <span className="flex items-center gap-2">
              <span className="text-amber-400">❖</span>
              <span>
                Curated Systems & Microservices ({content.secondaryProjects.length})
              </span>
            </span>
            <span className="text-amber-400 text-xs">
              {showSecondary ? "Hide ▲" : "Expand ▼"}
            </span>
          </button>

          {showSecondary && (
            <div className="grid grid-cols-1 gap-3 mt-3 animate-fadeIn">
              {content.secondaryProjects.map((proj) => (
                <ProjectCard key={proj.title} proj={proj} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full GitHub Footer Callout */}
      <div className="pt-2">
        <a
          href="https://github.com/SM33-07"
          target="_blank"
          rel="noopener noreferrer"
          className="
            pointer-events-auto
            flex
            items-center
            justify-center
            gap-2
            w-full
            p-3
            rounded-xl
            border
            border-dashed
            border-white/20
            bg-white/[0.02]
            hover:border-amber-400/50
            hover:bg-amber-500/[0.05]
            text-xs
            font-mono
            text-gray-300
            hover:text-amber-200
            transition-all
            touch-manipulation
          "
        >
          <span>Explore All Repositories on GitHub (SM33-07)</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}

/* ======================================
   Archives (Technical Skills)
====================================== */

function ArchivesContentComponent({ content }: { content: ArchivesContent }) {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-400 pb-1">
        Verified technical proficiencies across production projects, systems, and developer tools:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        {content.categories.map((category) => (
          <div
            key={category.category}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 hover:border-cyan-500/30 transition-colors"
          >
            <h3 className="mb-2.5 text-xs sm:text-[13px] font-bold font-mono tracking-wider text-cyan-300 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400" />
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="
                    rounded-md
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
    </div>
  );
}

/* ======================================
   Oracle (Bio, Education, Experience, Resume)
====================================== */

function OracleContentComponent({ content }: { content: OracleContent }) {
  const paragraphs = content.bio.split("\n\n");

  return (
    <div className="space-y-5">
      {/* 1. About / Positioning Bio */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-300 mb-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          Engineering Profile & Focus
        </h3>
        <div className="space-y-3">
          {paragraphs.map((p, idx) => (
            <p
              key={idx}
              className="text-xs sm:text-sm leading-relaxed text-gray-300 font-sans"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* 2. Formal Education */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 sm:p-5">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-2">
          <span>🎓</span> Formal Education
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h4 className="text-sm sm:text-base font-bold font-mono text-white">
            {content.education.degree}
          </h4>
          <span className="text-xs font-mono text-purple-300/80 shrink-0">
            {content.education.period}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-300 font-sans mt-0.5">
          {content.education.institution} · {content.education.location}
        </p>
      </div>

      {/* 3. Professional Experience Timeline */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-300 flex items-center gap-2">
          <span>⚡</span> Professional Leadership & Experience
        </h3>

        <div className="space-y-3">
          {content.experiences.map((exp) => (
            <div
              key={exp.role + exp.organization}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                <div>
                  <h4 className="text-sm sm:text-base font-bold font-mono text-white">
                    {exp.role}
                  </h4>
                  <p className="text-xs sm:text-sm text-purple-300/90 font-mono">
                    {exp.organization}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {exp.isCurrent && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  )}
                  <span className="text-xs font-mono text-gray-400">
                    {exp.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300/90 font-sans mt-2.5">
                {exp.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 text-xs leading-tight mt-1 shrink-0">
                      ▸
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Additional Contributions */}
      {content.additionalContributions && content.additionalContributions.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 mb-2.5">
            Additional Technical Initiatives & Committees
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-300">
            {content.additionalContributions.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col justify-between"
              >
                <span className="font-semibold text-white/90">{item.role}</span>
                <span className="text-gray-400 text-[11px]">
                  {item.organization} · {item.period}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Résumé PDF CTA */}
      <div className="pt-2">
        <a
          href={content.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="
            pointer-events-auto
            flex
            min-h-[48px]
            items-center
            justify-center
            gap-2.5
            rounded-xl
            bg-purple-600/20
            border
            border-purple-400/40
            px-5
            py-3
            text-xs sm:text-sm
            font-mono
            font-semibold
            text-purple-200
            hover:bg-purple-600/30
            hover:border-purple-400/70
            hover:text-white
            transition-all
            shadow-[0_0_20px_rgba(168,85,247,0.15)]
            active:scale-98
            touch-manipulation
          "
        >
          <span className="text-base">📄</span>
          <span>Download / View Résumé (PDF)</span>
          <span className="text-xs text-purple-400">↗</span>
        </a>
      </div>
    </div>
  );
}

/* ======================================
   Gateway (Social & Contact Links)
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
    <div className="space-y-3 mt-1">
      <p className="text-xs font-mono text-gray-400">
        Direct channels for technical inquiries, software engineering roles, and open source collaboration:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {content.contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              pointer-events-auto
              flex
              items-start
              gap-3.5
              p-4
              rounded-xl
              bg-white/[0.04]
              border
              border-white/10
              hover:border-pink-500/50
              hover:bg-pink-500/10
              transition-all
              duration-200
              group
              shadow-lg
              active:scale-98
              touch-manipulation
            "
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-pink-500/10 border border-pink-400/30 flex items-center justify-center text-pink-400 group-hover:scale-105 group-hover:bg-pink-500/20 transition-all shadow-[0_0_12px_rgba(236,72,153,0.2)]">
              <PlatformLogo label={contact.label} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-mono font-bold text-white group-hover:text-pink-300">
                  {contact.label}
                </span>
                <span className="text-xs text-pink-400/70 group-hover:text-pink-300">
                  ↗
                </span>
              </div>
              {contact.description && (
                <p className="text-xs text-gray-400 font-sans mt-0.5 line-clamp-2 leading-snug">
                  {contact.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
