"use client";

import { useEffect, useState } from "react";
import { ZONES } from "@/data/zones";
import { KEEPER_DIALOGUES } from "@/data/dialogue";
import { useGameStore } from "@/store/useGameStore";

export default function ZoneCutscene() {
  const currentZone = useGameStore((state) => state.currentZone);
  const interactionPhase = useGameStore((state) => state.interactionPhase);
  const completeZoneCutscene = useGameStore(
    (state) => state.completeZoneCutscene
  );
  const [revealed, setRevealed] = useState(false);

  const zone = ZONES.find((item) => item.id === currentZone);
  const keeper = currentZone ? KEEPER_DIALOGUES[currentZone] : null;
  const active = interactionPhase === "cutscene" && zone && keeper;

  useEffect(() => {
    if (!active) return;

    setRevealed(false);
    const revealTimer = window.setTimeout(() => setRevealed(true), 120);
    const finishTimer = window.setTimeout(completeZoneCutscene, 1700);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(finishTimer);
    };
  }, [active, completeZoneCutscene, currentZone]);

  if (!active || !zone || !keeper) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden pointer-events-auto">
      <div className="absolute inset-0 bg-[#03020a]/75 backdrop-blur-[2px]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(255,255,255,0.035) 4px)",
          animation: "zoneScan 1.4s linear infinite",
        }}
      />
      <div
        className="absolute inset-x-0 top-1/2 h-px"
        style={{
          backgroundColor: zone.color,
          boxShadow: `0 0 34px ${zone.color}, 0 0 80px ${zone.color}80`,
          transform: revealed ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <div className="relative flex h-full items-center justify-center px-6 text-center font-mono">
        <div
          className="w-full max-w-xl border-y py-8"
          style={{
            borderColor: `${zone.color}80`,
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.36em] text-white/55">
            Aether link established
          </p>
          <h2
            className="mt-4 text-3xl font-bold uppercase tracking-[0.18em] sm:text-5xl"
            style={{ color: zone.color, textShadow: `0 0 28px ${zone.color}80` }}
          >
            {zone.name}
          </h2>
          <p className="mt-4 text-sm tracking-[0.14em] text-white/70">
            {keeper.name} // {keeper.title}
          </p>
          <div className="mx-auto mt-6 h-1 w-28 overflow-hidden bg-white/10">
            <div
              className="h-full"
              style={{
                width: revealed ? "100%" : "0%",
                backgroundColor: zone.color,
                boxShadow: `0 0 16px ${zone.color}`,
                transition: "width 1.25s linear",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
