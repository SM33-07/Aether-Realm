"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { initializeAudio, playAmbient, playSfx } from "@/lib/audioManager";

/**
 * AetherEmblem — The world mark.
 *
 * Geometry: two equilateral triangles sharing a horizontal centre axis,
 * forming a vertically-oriented diamond that reads as an abstracted
 * crystal shard at any size. Drawn as SVG lines so the shape is
 * recognisable with colour and glow disabled (pure outline).
 */
function AetherEmblem({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  // Triangle points (centered on 100×120 viewBox)
  // Upper triangle: apex at top, base through centre
  // Lower triangle: apex at bottom, base through centre
  const w = 100;
  const h = 120;
  const cx = w / 2;
  const mid = h / 2;

  const topApex = `${cx},6`;
  const topBaseL = `10,${mid}`;
  const topBaseR = `${w - 10},${mid}`;
  const botApex = `${cx},${h - 6}`;

  // Inner crossbar at midline — a quiet structural detail
  const barY = mid;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size * (h / w)}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      {/* Upper triangle */}
      <polygon
        points={`${topApex} ${topBaseL} ${topBaseR}`}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Lower triangle */}
      <polygon
        points={`${botApex} ${topBaseL} ${topBaseR}`}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Horizon bar — subtle structural divider at the shared centre */}
      <line
        x1="18"
        y1={barY}
        x2={w - 18}
        y2={barY}
        strokeWidth="1.4"
        strokeOpacity="0.45"
      />
    </svg>
  );
}

type Phase = "silent" | "emblem" | "title" | "copy" | "ready" | "leaving";

export default function LandingScreen({ onEnter }: { onEnter?: () => void }) {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const startGame = useGameStore((s) => s.startGame);

  const [phase, setPhase] = useState<Phase>("silent");
  const [ctaHovered, setCtaHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const startingRef = useRef(false);

  /* Subtle mouse parallax on desktop */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 16;
      const ny = (e.clientY / window.innerHeight - 0.5) * 16;
      setMouseOffset({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* Advance through entry phases automatically */
  useEffect(() => {
    if (gameStarted) return;

    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setPhase("emblem"), 200));
    timers.push(setTimeout(() => setPhase("title"),  900));
    timers.push(setTimeout(() => setPhase("copy"),  1700));
    timers.push(setTimeout(() => setPhase("ready"), 2600));

    return () => timers.forEach(clearTimeout);
  }, [gameStarted]);

  const triggerStart = () => {
    if (startingRef.current || gameStarted) return;
    startingRef.current = true;

    try {
      initializeAudio();
      playAmbient();
      playSfx("interact");
    } catch {
      /* Audio blocked — continue anyway */
    }

    setPhase("leaving");
    setTimeout(() => {
      if (onEnter) {
        onEnter();
      } else {
        startGame();
      }
    }, 550);
  };

  /* Keyboard entry on desktop */
  useEffect(() => {
    if (gameStarted) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerStart();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

  if (gameStarted) return null;

  const visible = (from: Phase) => {
    const order: Phase[] = ["silent", "emblem", "title", "copy", "ready", "leaving"];
    return order.indexOf(phase) >= order.indexOf(from);
  };

  const leaving = phase === "leaving";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden select-none touch-manipulation"
      style={{
        opacity: leaving ? 0 : 1,
        transition: leaving ? "opacity 0.55s cubic-bezier(0.4, 0, 0.6, 1)" : "none",
        pointerEvents: leaving ? "none" : "auto",
      }}
      aria-label="Aether Realm — tap to enter"
    >
      {/* ── Cinematic atmospheric vignette backdrop ─────────────────────
          Allows the live 3D crystalline world to breathe through while
          keeping the editorial typography crisp, high-contrast, and focused. */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(5,4,12,0.94) 0%, rgba(5,4,12,0.88) 36%, rgba(5,4,12,0.45) 65%, rgba(5,4,12,0.15) 85%, rgba(5,4,12,0.5) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(5,4,12,0.84) 0%, rgba(5,4,12,0.95) 75%, #05040c 100%)",
        }}
      />
      {/* Perimeter edge vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 100px 30px rgba(5,4,12,0.85)",
        }}
      />

      {/* ── Focal light source — single distant purple-violet lamp ─────
          One, controlled, meaningful light rather than scatter glow. */}
      <div
        className="pointer-events-none absolute"
        aria-hidden="true"
        style={{
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(360px, 80vw)",
          height: "min(360px, 80vw)",
          background: "radial-gradient(ellipse at 50% 30%, rgba(109,40,217,0.18) 0%, rgba(88,28,135,0.06) 45%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* ── Main composition ─────────────────────────────────────────────
          Desktop: left-aligned, occupying the left 52% of the screen.
          The right half reveals the live 3D crystalline environment.
          Mobile: centered full-width column.
          Height-aware: centers smoothly on short screens (e.g. 844x390 landscape). */}
      <div
        className="
          relative h-full flex flex-col items-center justify-center
          md:items-start md:justify-center lg:justify-end
          lg:pb-16 md:pl-[max(5vw,3rem)]
          [@media(max-height:600px)]:justify-center [@media(max-height:600px)]:pb-2
          pointer-events-none px-4 md:px-0
        "
        style={{
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Emblem */}
        <div
          className="mb-4 sm:mb-8 lg:mb-8 [@media(max-height:550px)]:mb-2 text-purple-400/90"
          style={{
            opacity: visible("emblem") ? 1 : 0,
            transform: visible("emblem") ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
          aria-hidden="true"
        >
          <AetherEmblem size={34} />
        </div>

        {/* ── Title: AETHER REALM ────────────────────────────────────── */}
        <h1
          className="
            font-sans font-light tracking-[0.18em] sm:tracking-[0.22em]
            text-[clamp(1.75rem,5.5vw,4.5rem)]
            [@media(max-height:550px)]:text-[1.85rem]
            text-white leading-none
            mb-2 sm:mb-3 [@media(max-height:550px)]:mb-1
          "
          style={{
            opacity: visible("title") ? 1 : 0,
            transform: visible("title") ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.7s ease 0.05s, transform 0.7s ease 0.05s",
            letterSpacing: "0.18em",
          }}
        >
          AETHER REALM
        </h1>

        {/* Attribution */}
        <p
          className="
            font-sans text-[clamp(0.68rem,1.8vw,0.85rem)]
            text-gray-400 tracking-[0.06em]
            mb-3 sm:mb-6 [@media(max-height:550px)]:mb-2
          "
          style={{
            opacity: visible("title") ? 1 : 0,
            transition: "opacity 0.6s ease 0.15s",
          }}
        >
          A portfolio by Soham More
        </p>

        {/* Supporting copy — one clear, specific sentence */}
        <p
          className="
            font-sans text-[clamp(0.72rem,2vw,0.875rem)]
            [@media(max-height:550px)]:text-[0.72rem]
            text-gray-500 leading-relaxed max-w-[28rem]
            text-center md:text-left
            mb-6 sm:mb-10 [@media(max-height:550px)]:mb-3
          "
          style={{
            opacity: visible("copy") ? 1 : 0,
            transform: visible("copy") ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
          }}
        >
          Four zones. Real projects, skills, and contact — explored
          through an isometric RPG world built with Three.js.
        </p>

        {/* ── Primary CTA ───────────────────────────────────────────── */}
        <div
          className="pointer-events-auto"
          style={{
            opacity: visible("ready") ? 1 : 0,
            transform: visible("ready") ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
          }}
        >
          <button
            type="button"
            onClick={triggerStart}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            aria-label="Enter the Aether Realm"
            className="
              group relative
              font-mono text-[0.65rem] sm:text-[0.7rem]
              tracking-[0.28em] sm:tracking-[0.32em]
              uppercase
              px-6 py-3 sm:px-8 sm:py-3.5
              [@media(max-height:550px)]:py-2.5 [@media(max-height:550px)]:px-5
              min-h-[44px] min-w-[48px]
              transition-colors duration-300
            "
            style={{
              color: ctaHovered ? "rgb(216,180,254)" : "rgb(192,132,252)",
              border: "1px solid",
              borderColor: ctaHovered
                ? "rgba(216,180,254,0.55)"
                : "rgba(168,85,247,0.3)",
              transition:
                "color 0.3s ease, border-color 0.3s ease, background 0.3s ease",
              background: ctaHovered
                ? "rgba(88,28,135,0.18)"
                : "transparent",
            }}
          >
            {/* Desktop label */}
            <span className="hidden md:inline">ENTER THE REALM</span>
            {/* Mobile label */}
            <span className="md:hidden">ENTER</span>

            {/* Expanding underline on hover */}
            <span
              className="absolute bottom-0 left-0 h-px bg-purple-400/60 transition-all duration-500 ease-out"
              style={{ width: ctaHovered ? "100%" : "0%" }}
              aria-hidden="true"
            />
          </button>

          {/* Sub-hint text: desktop vs. touch */}
          <p
            className="mt-2 font-mono text-[0.58rem] tracking-[0.16em] text-gray-600 text-center md:text-left"
          >
            <span className="hidden md:inline">PRESS ENTER TO BEGIN</span>
            <span className="md:hidden">TAP TO ENTER THE REALM</span>
          </p>
        </div>
      </div>

      {/* ── World version / system label — bottom-right metadata ───── */}
      <div
        className="pointer-events-none absolute bottom-5 right-5 sm:bottom-6 sm:right-6 text-right"
        aria-hidden="true"
        style={{
          opacity: visible("ready") ? 0.35 : 0,
          transition: "opacity 0.8s ease 0.2s",
        }}
      >
        <p className="font-mono text-[0.55rem] tracking-[0.14em] text-gray-500 uppercase">
          Aether Realm
        </p>
        <p className="font-mono text-[0.5rem] tracking-[0.1em] text-gray-600 mt-0.5">
          Three.js · React Three Fiber
        </p>
      </div>
    </div>
  );
}
