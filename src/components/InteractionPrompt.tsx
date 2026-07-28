"use client";

import { KEEPER_DIALOGUES } from "@/data/dialogue";
import { useGameStore } from "@/store/useGameStore";

export default function InteractionPrompt() {
  const nearZone = useGameStore((state) => state.nearZone);
  const interactionPhase = useGameStore((state) => state.interactionPhase);
  const keeper = nearZone ? KEEPER_DIALOGUES[nearZone] : null;

  if (!keeper || interactionPhase !== "idle") return null;

  return (
    <div
      className="pointer-events-none absolute bottom-32 left-1/2 z-50 -translate-x-1/2"
      style={{ animation: "fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
    >
      <div className="flex items-center gap-3 font-mono">
        <span
          className="flex h-8 w-8 items-center justify-center border text-sm font-bold"
          style={{
            background: `${keeper.color}20`,
            borderColor: `${keeper.color}60`,
            color: keeper.color,
            boxShadow: `0 0 12px ${keeper.color}25`,
            animation: "promptPulse 2s ease-in-out infinite",
          }}
        >
          E
        </span>
        <span className="text-sm tracking-wide" style={{ color: `${keeper.color}cc` }}>
          Link with <strong style={{ color: keeper.color }}>{keeper.name}</strong>
        </span>
      </div>
    </div>
  );
}
