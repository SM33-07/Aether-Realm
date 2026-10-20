"use client";

import { useEffect, useState } from "react";
import { audioManager, toggleMute, playSfx } from "@/lib/audioManager";
import { useGameStore } from "@/store/useGameStore";

export default function AudioToggle() {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    return audioManager.subscribe((isMuted) => {
      setMuted(isMuted);
    });
  }, []);

  if (!gameStarted) return null;

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const newMuted = toggleMute();
    if (!newMuted) {
      playSfx("click");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={muted ? "Unmute audio" : "Mute audio"}
      title={muted ? "Unmute audio" : "Mute audio"}
      className="
        fixed
        top-[max(0.75rem,env(safe-area-inset-top))]
        right-[max(0.75rem,env(safe-area-inset-right))]
        z-50
        flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center
        rounded-xl border
        bg-[#09090f]/90
        backdrop-blur-md
        transition-all duration-200
        hover:scale-105 active:scale-95
        touch-manipulation
        select-none
      "
      style={{
        borderColor: muted ? "rgba(239, 68, 68, 0.4)" : "rgba(168, 85, 247, 0.4)",
        boxShadow: muted
          ? "0 0 12px rgba(239, 68, 68, 0.15)"
          : "0 0 16px rgba(168, 85, 247, 0.2)",
      }}
    >
      {muted ? (
        <svg
          className="h-4 w-4 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-purple-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
    </button>
  );
}
