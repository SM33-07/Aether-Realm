"use client";

import { useGameStore } from "@/store/useGameStore";
import { ZONES } from "@/data/zones";

export default function HeaderGuide() {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const visitedZones = useGameStore((s) => s.visitedZones);
  const nearZone = useGameStore((s) => s.nearZone);
  const dialogueActive = useGameStore((s) => s.dialogueActive);
  const cutsceneActive = useGameStore((s) => s.cutsceneActive);
  const interactionPhase = useGameStore((s) => s.interactionPhase);

  if (
    !gameStarted ||
    dialogueActive ||
    cutsceneActive ||
    interactionPhase === "cutscene" ||
    interactionPhase === "dialogue" ||
    interactionPhase === "content"
  ) {
    return null;
  }

  const nextUnvisited = ZONES.find((z) => !visitedZones.includes(z.id));
  const targetZone = nearZone
    ? ZONES.find((z) => z.id === nearZone)
    : nextUnvisited || ZONES[0];

  const isNear = Boolean(nearZone);
  const allVisited = visitedZones.length === ZONES.length;

  return (
    <div
      className="
        fixed top-[calc(max(0.6rem,env(safe-area-inset-top))+7.4rem)] left-3 z-40 pointer-events-none max-w-[calc(100vw-5rem)] sm:max-w-xs
        md:absolute md:top-4 md:left-1/2 md:right-auto md:max-w-[90vw]
        md:-translate-x-1/2 md:w-max
      "
    >
      <div
        className="
          flex items-center gap-2.5
          rounded-xl md:rounded-full
          bg-[#09090f]/95 backdrop-blur-md
          border border-purple-500/30
          px-3 py-2 md:px-5 md:py-2.5
          shadow-[0_0_20px_rgba(168,85,247,0.15)]
          font-mono text-xs text-purple-200
        "
        style={{
          borderColor: isNear && targetZone ? `${targetZone.color}80` : undefined,
          boxShadow:
            isNear && targetZone
              ? `0 0 25px ${targetZone.color}30`
              : undefined,
        }}
      >
        <div className="flex shrink-0 items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-purple-500/20 border border-purple-400/40 animate-pulse">
          <span className="text-[9px] md:text-[10px] text-purple-300 font-bold">
            ▶
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {allVisited ? (
            <p className="text-emerald-400 font-semibold text-[11px] md:text-xs truncate">
              ✦ ALL REGIONS UNLOCKED
            </p>
          ) : isNear ? (
            <>
              {/* Mobile View */}
              <div className="md:hidden">
                <p className="font-semibold text-[11px] text-gray-100 truncate">
                  NEARBY:{" "}
                  <span style={{ color: targetZone?.color }}>
                    {targetZone?.name}
                  </span>
                </p>
                <p className="text-[9px] text-gray-400">TAP INTERACT TO ENTER</p>
              </div>

              {/* Desktop View */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-gray-300">Approach completed. Press</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/30 border border-purple-400/60 font-bold text-white shadow-[0_0_8px_rgba(168,85,247,0.4)] animate-bounce">
                  E
                </span>
                <span className="text-gray-300">to interact with</span>
                <strong style={{ color: targetZone?.color }}>
                  {targetZone?.name}
                </strong>
              </div>
            </>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden">
                <p className="text-[10px] text-purple-300 font-semibold tracking-wide">
                  MISSION TARGET
                </p>
                <p className="text-[11px] text-gray-100 truncate">
                  Approach{" "}
                  <strong style={{ color: targetZone?.color }}>
                    {targetZone?.name}
                  </strong>
                </p>
                <p className="text-[9px] text-gray-400">
                  Move using the joystick
                </p>
              </div>

              {/* Desktop View */}
              <div className="hidden md:flex items-center gap-2 flex-wrap">
                <span className="text-gray-400 uppercase tracking-wider text-[10px] font-semibold text-purple-400">
                  MISSION:
                </span>
                <span className="text-gray-200">Walk towards</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold text-[11px]">
                  WASD
                </span>
                <span className="text-gray-400">or</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold text-[11px]">
                  ARROWS
                </span>
                <span className="text-gray-200">➔ approach</span>
                <span
                  className="font-bold underline underline-offset-4"
                  style={{ color: targetZone?.color || "#a855f7" }}
                >
                  {targetZone?.name}
                </span>
                <span className="text-gray-200">& press</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/50 font-bold text-purple-200">
                  E
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}