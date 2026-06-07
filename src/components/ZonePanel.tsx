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
  const currentZone = useGameStore(
    (s) => s.currentZone
  );

  const zone = ZONES.find(
    (z) => z.id === currentZone
  );

  if (!zone) return null;

  return (
    <div
      key={zone.id}
      style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      className="
        absolute
        bottom-6
        left-1/2
        w-[720px]
        max-w-[92vw]
        pointer-events-none
        z-50
      "
    >
      <div
        className="
          bg-[#09090f]/95
          backdrop-blur-md
          border
          border-white/10
          rounded-2xl
          overflow-hidden
          shadow-2xl
        "
      >
        {/* Accent Border */}
        <div
          className="h-1 w-full"
          style={{
            backgroundColor: zone.color,
          }}
        />

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-5">
            <h2
              className="
                text-2xl
                font-bold
                tracking-wide
              "
              style={{
                color: zone.color,
              }}
            >
              {zone.name}
            </h2>

            <p
              className="
                mt-2
                text-sm
                italic
                text-gray-400
                leading-relaxed
              "
            >
              {zone.lore}
            </p>
          </div>

          {/* Dynamic Content */}
          <div className="mt-5">
            {(() => {
              switch (zone.content.type) {
                case "forge":
                  return (
                    <ForgeContentComponent
                      content={
                        zone.content
                      }
                    />
                  );

                case "archives":
                  return (
                    <ArchivesContentComponent
                      content={
                        zone.content
                      }
                    />
                  );

                case "oracle":
                  return (
                    <OracleContentComponent
                      content={
                        zone.content
                      }
                    />
                  );

                case "gateway":
                  return (
                    <GatewayContentComponent
                      content={
                        zone.content
                      }
                    />
                  );

                default:
                  return null;
              }
            })()}
          </div>
        </div>

        {/* Footer Hint */}
        <div className="border-t border-white/5 bg-white/[0.02] px-6 py-4 flex justify-between items-center">
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            Link Stable
          </span>
          <span className="text-xs text-gray-400 font-mono tracking-wide">
            Walk away to close
          </span>
        </div>
      </div>
    </div>
  );
}

/* ======================================
   Forge
====================================== */

function ForgeContentComponent({
  content,
}: {
  content: ForgeContent;
}) {
  return (
    <div className="space-y-4">
      {content.projects.map(
        (project) => (
          <div
            key={project.title}
            className="
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-4
            "
          >
            <h3
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              {project.title}
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-gray-300
                leading-relaxed
              "
            >
              {project.description}
            </p>

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-2
              "
            >
              {project.tags.map(
                (tag) => (
                  <span
                    key={tag}
                    className="
                      rounded-md
                      bg-white/10
                      px-2
                      py-1
                      text-xs
                      text-gray-200
                    "
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  pointer-events-auto
                  mt-4
                  inline-block
                  text-sm
                  text-amber-400
                  hover:text-amber-300
                "
              >
                View Repository →
              </a>
            )}
          </div>
        )
      )}
    </div>
  );
}

/* ======================================
   Archives
====================================== */

function ArchivesContentComponent({
  content,
}: {
  content: ArchivesContent;
}) {
  return (
    <div className="space-y-5">
      {content.categories.map(
        (category) => (
          <div
            key={category.category}
          >
            <h3
              className="
                mb-3
                text-lg
                font-semibold
                text-cyan-300
              "
            >
              {category.category}
            </h3>

            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              {category.skills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-md
                      bg-white/10
                      px-3
                      py-1
                      text-sm
                      text-gray-200
                    "
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* ======================================
   Oracle
====================================== */

function OracleContentComponent({
  content,
}: {
  content: OracleContent;
}) {
  return (
    <div>
      <p
        className="
          text-sm
          leading-relaxed
          text-gray-300
        "
      >
        {content.bio}
      </p>

      <a
        href={content.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="
          pointer-events-auto
          mt-5
          inline-block
          rounded-lg
          bg-white/10
          px-4
          py-2
          text-sm
          text-white
          hover:bg-white/20
        "
      >
        View Resume
      </a>
    </div>
  );
}

/* ======================================
   Gateway
====================================== */

function GatewayContentComponent({
  content,
}: {
  content: GatewayContent;
}) {
  return (
    <div className="space-y-3">
      {content.contacts.map(
        (contact) => (
          <a
            key={contact.label}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              pointer-events-auto
              block
              rounded-lg
              bg-white/10
              px-4
              py-3
              text-sm
              text-gray-200
              transition
              hover:bg-white/20
            "
          >
            {contact.label}
          </a>
        )
      )}
    </div>
  );
}