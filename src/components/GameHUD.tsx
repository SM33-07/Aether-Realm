/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { playSfx } from "@/lib/audioManager";

const RANKS = ["Wanderer", "Seeker", "Arcanist", "Voidwalker", "Aethermage"];

export default function GameHUD() {
  const { level, currentXP, xpToNextLevel, currentZone, resetGame } =
    useGameStore();

  const xpPercent = (currentXP / xpToNextLevel) * 100;
  const filledSegments = Math.floor(xpPercent / 10);
  const rank = RANKS[Math.min(level - 1, RANKS.length - 1)];

  // --- XP animation tracking ---
  const prevXP = useRef(currentXP);
  const [xpFlash, setXpFlash] = useState(false);

  useEffect(() => {
    if (currentXP > prevXP.current) {
      setXpFlash(true);
      setTimeout(() => setXpFlash(false), 300);
    }
    prevXP.current = currentXP;
  }, [currentXP]);

  // --- Level up glitch & sound ---
  const prevLevel = useRef(level);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (level > prevLevel.current) {
      setGlitch(true);
      playSfx("levelUp");
      setTimeout(() => setGlitch(false), 250);
    }
    prevLevel.current = level;
  }, [level]);

  // --- Simple event log ---
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (currentZone) {
      setLog((prev) => [`Entered: ${currentZone}`, ...prev].slice(0, 3));
    }
  }, [currentZone]);

  // --- Zone signal lock text ---
  const [zoneDisplay, setZoneDisplay] = useState("— void —");

  useEffect(() => {
    if (!currentZone) {
      setZoneDisplay("— void —");
      return;
    }

    const steps = ["— scanning —", "…locking…", currentZone];
    let i = 0;

    const interval = setInterval(() => {
      setZoneDisplay(steps[i]);
      i++;
      if (i >= steps.length) clearInterval(interval);
    }, 120);

    return () => clearInterval(interval);
  }, [currentZone]);

  // --- Dev mode: Reset button toggled via Ctrl+Shift+R ---
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        setShowReset((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={`fixed top-[max(0.6rem,env(safe-area-inset-top))] left-[max(0.6rem,env(safe-area-inset-left))] z-30 text-purple-200 p-2.5 sm:p-4 rounded-xl w-[calc(100vw-4.5rem)] max-w-[240px] sm:max-w-[280px] font-mono bg-black/80 backdrop-blur-md border border-purple-500/20 overflow-hidden select-none ${
        glitch ? "translate-x-[2px] skew-x-2" : ""
      }`}
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(168,85,247,0.03) 2px,
          rgba(168,85,247,0.03) 4px
        )`,
        animation: "voidFlicker 6s infinite",
      }}
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-500" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-500" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500" />

      {/* Header */}
      <div className="mb-1 text-[8px] sm:text-[10px] opacity-70 tracking-widest truncate">
        SYNAPTIC LINK ESTABLISHED
      </div>

      {/* Rank & Level */}
      <div className="mb-2 sm:mb-2.5">
        <div className="text-sm sm:text-base font-bold text-purple-400 tracking-wide truncate">
          {rank}
        </div>
        <div className="text-[9px] sm:text-[10px] opacity-60">
          Designation Lv.{level}
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-2 sm:mb-2.5">
        <div className="text-[9px] sm:text-[10px] mb-1 flex justify-between items-center opacity-85">
          <span>AETHER CHARGE</span>
          <span className="font-bold">
            {currentXP}/{xpToNextLevel}
          </span>
        </div>

        <div className="flex gap-0.5 sm:gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 sm:h-2 flex-1 min-w-0 rounded-[1px] transition-all duration-200 ${
                xpFlash && i < filledSegments
                  ? "shadow-[0_0_8px_#a855f7]"
                  : ""
              }`}
              style={{
                background: i < filledSegments ? "#a855f7" : "#1e1a3a",
              }}
            />
          ))}
        </div>
      </div>

      {/* Zone Anchor */}
      <div className="text-[10px] sm:text-xs mb-1 truncate">
        ANCHOR:{" "}
        <span className="text-purple-400 font-semibold">{zoneDisplay}</span>
      </div>

      {/* Secondary Event log (hidden on tiny screens, compact on larger) */}
      <div className="hidden sm:block text-[9px] opacity-65 space-y-0.5 pt-1 border-t border-purple-500/15">
        {log.map((entry, i) => (
          <div key={i} className="truncate">
            {">"} {entry}
          </div>
        ))}
      </div>

      {/* Dev Reset Button */}
      {showReset && (
        <button
          onClick={() => resetGame()}
          className="pointer-events-auto mt-2 w-full text-center text-[9px] tracking-wider text-purple-400/80 hover:text-purple-300 border border-purple-500/25 hover:border-purple-500/50 bg-purple-950/20 hover:bg-purple-950/40 rounded py-1 transition-all cursor-pointer font-mono"
        >
          [ RESET REALM ]
        </button>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes voidFlicker {
          0%,
          100% {
            opacity: 1;
          }
          98% {
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}