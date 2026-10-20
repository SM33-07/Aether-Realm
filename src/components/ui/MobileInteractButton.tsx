"use client";

import { useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { ZONES } from "@/data/zones";
import { useIsMobile } from "@/hooks/useIsMobile";
import { playSfx } from "@/lib/audioManager";

export default function MobileInteractButton() {
  const isMobile = useIsMobile();
  const gameStarted = useGameStore((s) => s.gameStarted);
  const nearZone = useGameStore((s) => s.nearZone);
  const interactionPhase = useGameStore((s) => s.interactionPhase);
  const dialogueActive = useGameStore((s) => s.dialogueActive);
  const cutsceneActive = useGameStore((s) => s.cutsceneActive);
  const interactWithZone = useGameStore((s) => s.interactWithZone);

  const lastClickTimeRef = useRef(0);

  const zone = ZONES.find((item) => item.id === nearZone);

  const isAvailable =
    isMobile &&
    gameStarted &&
    Boolean(zone) &&
    interactionPhase === "idle" &&
    !dialogueActive &&
    !cutsceneActive;

  if (!isAvailable || !zone) {
    return null;
  }

  const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    if (now - lastClickTimeRef.current < 400) return; // Debounce rapid double taps
    lastClickTimeRef.current = now;

    playSfx("interact");
    interactWithZone();
  };

  const zoneColor = zone.color || "#c084fc";

  return (
    <button
      type="button"
      onClick={handleInteract}
      onTouchEnd={handleInteract}
      aria-label={`Interact with ${zone.name}`}
      className="
        fixed
        bottom-[calc(env(safe-area-inset-bottom,0px)+4.75rem)]
        right-[calc(env(safe-area-inset-right,0px)+1rem)]
        z-[65]
        flex min-h-[48px] min-w-[48px] max-w-[65vw] items-center justify-center gap-2.5
        rounded-2xl border
        bg-[#09090f]/95 px-5 py-3
        font-mono text-xs font-bold tracking-widest
        backdrop-blur-xl
        transition-all duration-200
        active:scale-95
        touch-manipulation
        select-none
      "
      style={{
        borderColor: `${zoneColor}80`,
        color: zoneColor,
        boxShadow: `0 0 24px ${zoneColor}35, inset 0 0 12px ${zoneColor}20`,
        animation: "pulse 2s infinite ease-in-out",
      }}
    >
      <span className="text-sm font-black" aria-hidden="true">
        ✦
      </span>
      <span className="truncate">INTERACT</span>
    </button>
  );
}
