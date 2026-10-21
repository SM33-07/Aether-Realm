"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { ZONES } from "@/data/zones";
import { playSfx } from "@/lib/audioManager";

export default function CutsceneOverlay() {
  const cutsceneActive = useGameStore((s) => s.cutsceneActive);
  const currentZone = useGameStore((s) => s.currentZone);
  const completeZoneCutscene = useGameStore((s) => s.completeZoneCutscene);

  const completedRef = useRef(false);

  const zone = ZONES.find((z) => z.id === currentZone);

  const dismiss = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    try {
      playSfx("zoneEnter");
    } catch {
      /* Audio handled gracefully */
    }
    completeZoneCutscene();
  };

  useEffect(() => {
    if (!cutsceneActive) {
      completedRef.current = false;
      return;
    }

    try {
      playSfx("zoneEnter");
    } catch {
      /* Audio handled gracefully */
    }

    // Auto-advance after 3.2 seconds
    const timer = setTimeout(() => {
      dismiss();
    }, 3200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cutsceneActive]);

  // Keyboard skip listener
  useEffect(() => {
    if (!cutsceneActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ([" ", "Enter", "Escape"].includes(e.key)) {
        e.preventDefault();
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cutsceneActive]);

  if (!cutsceneActive || !zone) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col justify-between pointer-events-auto select-none touch-manipulation"
      onClick={dismiss}
      style={{
        background: "rgba(5, 4, 12, 0.45)",
        backdropFilter: "blur(1.5px)",
        WebkitBackdropFilter: "blur(1.5px)",
      }}
      role="dialog"
      aria-label={`${zone.name} discovery cinematic`}
    >
      {/* ── Top Letterbox Bar ────────────────────────────────────────── */}
      <div className="w-full bg-[#05040c]/90 border-b border-white/[0.08] px-5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: zone.color }}
          />
          <span
            className="text-[11px] sm:text-xs tracking-[0.25em] uppercase font-mono font-medium"
            style={{ color: zone.color }}
          >
            REGION IDENTIFIED // {zone.name.toUpperCase()}
          </span>
        </div>
        <span className="text-[10px] tracking-[0.16em] uppercase font-mono text-gray-500 hidden sm:inline">
          Aether Realm Codex
        </span>
      </div>

      {/* ── Central Cinematic Reveal Card ───────────────────────────── */}
      <div className="flex flex-col items-center justify-center px-6 text-center my-auto pointer-events-none">
        {/* Subtle glowing radial backdrop */}
        <div
          className="pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-25"
          style={{ background: zone.color }}
        />

        {/* Small category tag */}
        <p
          className="text-[10px] sm:text-xs tracking-[0.32em] font-mono uppercase mb-2"
          style={{ color: `${zone.color}cc` }}
        >
          — SECTOR CONVERGENCE —
        </p>

        {/* Zone Title */}
        <h2
          className="font-sans font-light tracking-[0.2em] text-[clamp(2rem,7vw,3.8rem)] text-white leading-none mb-3 sm:mb-4"
          style={{
            textShadow: `0 0 35px ${zone.color}60`,
          }}
        >
          {zone.name.toUpperCase()}
        </h2>

        {/* Zone Lore */}
        <p className="font-sans text-xs sm:text-sm text-gray-300/90 leading-relaxed max-w-lg mx-auto">
          {zone.lore}
        </p>
      </div>

      {/* ── Bottom Letterbox Bar with Skip Action ───────────────────── */}
      <div className="w-full bg-[#05040c]/90 border-t border-white/[0.08] px-5 sm:px-8 py-3 sm:py-4 flex items-center justify-between pointer-events-auto">
        <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] text-gray-500 uppercase">
          <span className="hidden sm:inline">PRESS SPACE OR ENTER TO SKIP</span>
          <span className="sm:hidden">TAP TO CONTINUE</span>
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="
            font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase
            px-4 py-2 min-h-[40px]
            text-gray-300 hover:text-white
            border border-white/10 hover:border-white/30
            rounded-md bg-white/5 hover:bg-white/10
            transition-all duration-200
            touch-manipulation flex items-center gap-1.5
          "
          aria-label="Skip zone cinematic"
        >
          <span>Skip</span>
          <span>▸</span>
        </button>
      </div>
    </div>
  );
}
