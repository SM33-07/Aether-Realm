"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { playSfx } from "@/lib/audioManager";

/**
 * CinematicIntro — world context card that plays once after game start.
 *
 * Visual identity: same AetherEmblem mark, letterbox bars using solid
 * dark rather than pure black, restrained copy that tells the visitor
 * what they're about to do rather than making sci-fi system noises.
 *
 * Duration: ~5 s auto-advance. Immediately skippable via tap/key.
 * Respects reduced-motion — timers still fire but visual transitions
 * are suppressed by CSS media query in globals.css.
 */

function AetherEmblem({ size = 28 }: { size?: number }) {
  const w = 100;
  const h = 120;
  const cx = w / 2;
  const mid = h / 2;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size * (h / w)}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <polygon
        points={`${cx},6 10,${mid} ${w - 10},${mid}`}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <polygon
        points={`${cx},${h - 6} 10,${mid} ${w - 10},${mid}`}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <line
        x1="18" y1={mid}
        x2={w - 18} y2={mid}
        strokeWidth="1.2"
        strokeOpacity="0.38"
      />
    </svg>
  );
}

const STAGE_LABELS = [
  "Materialising the Aether grid…",
  "Four zones await your arrival.",
  "The Forge · The Archives · The Oracle · The Gateway",
] as const;

export default function CinematicIntro({ onComplete }: { onComplete?: () => void }) {
  const [active, setActive] = useState(true);
  const [fading, setFading] = useState(false);
  const [stage, setStage] = useState(0);
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setFading(true);
    playSfx("zoneEnter");
    setTimeout(() => {
      setActive(false);
      onComplete?.();
    }, 450);
  };

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1600);
    const t2 = setTimeout(() => setStage(2), 3200);
    const t3 = setTimeout(dismiss, 5200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if ([" ", "Enter", "Escape"].includes(e.key)) {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[85] flex flex-col justify-between cursor-pointer select-none touch-manipulation"
      onClick={dismiss}
      style={{
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 0.5s ease-out" : "opacity 0.4s ease-in",
        background: "rgba(5,4,12,0.88)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        pointerEvents: fading ? "none" : "auto",
      }}
      aria-label="Cinematic intro — tap to skip"
    >
      {/* Top letterbox: emblem + zone list */}
      <div
        className="w-full bg-[#05040c]/90 border-b border-white/[0.06] flex items-center justify-between px-5 sm:px-8 py-2.5 sm:py-3.5"
      >
        <div className="flex items-center gap-3 text-purple-400/75">
          <AetherEmblem size={20} />
          <span className="font-mono text-[0.58rem] tracking-[0.22em] text-gray-500 uppercase hidden sm:inline">
            Aether Realm
          </span>
        </div>
        <span className="font-mono text-[0.58rem] tracking-[0.18em] text-gray-600 uppercase">
          Portfolio — Soham More
        </span>
      </div>

      {/* Central stage text */}
      <div className="flex flex-col items-center justify-center px-4 text-center my-auto">
        <div
          className="text-purple-400/80 mb-3 sm:mb-6 [@media(max-height:550px)]:mb-1.5"
          aria-hidden="true"
        >
          <AetherEmblem size={32} />
        </div>

        <p
          className="font-mono text-[0.58rem] sm:text-[0.65rem] tracking-[0.28em] text-gray-500 uppercase mb-2 sm:mb-3"
          key={stage}
          style={{ animation: "aetherReveal 0.45s ease forwards" }}
        >
          {STAGE_LABELS[stage]}
        </p>

        <h2
          className="font-sans font-light tracking-[0.18em] text-[clamp(1.35rem,5vw,2.8rem)] text-white/90 leading-none"
          style={{
            textShadow: "0 0 32px rgba(109,40,217,0.45)",
          }}
        >
          AETHER REALM
        </h2>
      </div>

      {/* Bottom letterbox: skip control */}
      <div className="w-full bg-[#05040c]/90 border-t border-white/[0.06] flex items-center justify-end px-5 sm:px-8 py-2.5 sm:py-3.5">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
          className="font-mono text-[0.58rem] tracking-[0.2em] text-gray-500 hover:text-gray-300 uppercase transition-colors duration-200 touch-manipulation min-h-[36px] px-3 flex items-center"
          aria-label="Skip cinematic intro"
        >
          Skip ▸
        </button>
      </div>
    </div>
  );
}
