"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useGameStore } from "@/store/useGameStore";

/**
 * AetherEmblem (inlined here to keep LoadingScreen self-contained
 * without a shared import that might cause tree-shaking issues).
 * Same geometry as LandingScreen — two equilateral triangles sharing
 * a horizontal midline axis.
 */
function AetherEmblem({ size = 36 }: { size?: number }) {
  const w = 100;
  const h = 120;
  const cx = w / 2;
  const mid = h / 2;

  const topApex = `${cx},6`;
  const topBaseL = `10,${mid}`;
  const topBaseR = `${w - 10},${mid}`;
  const botApex = `${cx},${h - 6}`;

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
        points={`${topApex} ${topBaseL} ${topBaseR}`}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <polygon
        points={`${botApex} ${topBaseL} ${topBaseR}`}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <line
        x1="18"
        y1={mid}
        x2={w - 18}
        y2={mid}
        strokeWidth="1.4"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const { active, progress, errors } = useProgress();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* Brief mount delay so the loader isn't a flash on instantaneous loads */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Safety: dismiss after 4s regardless of progress */
  useEffect(() => {
    const t = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 450);
    }, 4000);
    return () => clearTimeout(t);
  }, [onComplete]);

  useEffect(() => {
    if (!active && progress === 100) {
      const t = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 450);
      }, 280);
      return () => clearTimeout(t);
    }
  }, [active, progress, onComplete]);

  if (!visible) return null;

  const progressPct = active ? Math.max(8, progress) : 100;

  return (
    <div
      className="fixed inset-0 z-[120] bg-[#05040c] flex flex-col items-center justify-center pointer-events-none"
      style={{
        opacity: fading ? 0 : mounted ? 1 : 0,
        transition: fading
          ? "opacity 0.45s cubic-bezier(0.4, 0, 1, 1)"
          : "opacity 0.3s ease",
      }}
      role="status"
      aria-label="Loading Aether Realm"
      aria-live="polite"
    >
      {/* Emblem — same mark as landing screen */}
      <div className="text-purple-400/70 mb-6" aria-hidden="true">
        <AetherEmblem size={38} />
      </div>

      {/* Status label */}
      <p className="font-mono text-[0.625rem] tracking-[0.22em] text-gray-500 uppercase mb-5">
        {errors.length > 0 ? "Stabilising link…" : "Synchronising the Aether"}
      </p>

      {/* Progress track — measured, not indeterminate when data exists */}
      <div
        className="w-32 sm:w-40 h-px bg-white/10 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-purple-500/70"
          style={{
            width: `${progressPct}%`,
            transition: "width 0.4s ease-out",
          }}
        />
      </div>
    </div>
  );
}
