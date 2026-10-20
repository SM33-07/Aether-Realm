"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { playSfx } from "@/lib/audioManager";

export default function ControlsPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const gameStarted = useGameStore((s) => s.gameStarted);
  const dialogueActive = useGameStore((s) => s.dialogueActive);
  const interactionPhase = useGameStore((s) => s.interactionPhase);

  // Toggle palette with '?' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-close when dialogue or zone content opens to prevent obscuring
  useEffect(() => {
    if (dialogueActive || interactionPhase === "content") {
      setIsOpen(false);
    }
  }, [dialogueActive, interactionPhase]);

  if (!gameStarted || dialogueActive || interactionPhase === "content") {
    return null;
  }

  const handleToggle = () => {
    playSfx("click");
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] right-[calc(env(safe-area-inset-right,0px)+1rem)] z-50 pointer-events-auto select-none font-mono">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Toggle controls help"
        className="flex items-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-xl bg-[#09090f]/90 border border-purple-500/40 text-purple-200 text-xs font-semibold backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:bg-purple-500/20 hover:border-purple-400 transition-all active:scale-95 touch-manipulation"
      >
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400/50 text-[10px] text-purple-300 font-bold">
          ⌘
        </span>
        <span className="md:hidden">TOUCH HELP</span>
        <span className="hidden md:inline">CONTROLS</span>
        <span className="text-[10px] text-purple-400/80">
          {isOpen ? "▼" : "▲"}
        </span>
      </button>

      {/* Expanded Palette Card */}
      {isOpen && (
        <div
          style={{
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
          className="absolute bottom-12 right-0 w-[min(18rem,calc(100vw-2rem))] md:w-72 p-4 rounded-2xl bg-[#09090f]/95 border border-purple-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-xs text-gray-300 space-y-3 max-h-[70vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span className="font-bold text-white tracking-wider">
                <span className="md:hidden">TOUCH GUIDE</span>
                <span className="hidden md:inline">COMMAND PALETTE</span>
              </span>
            </div>
            <span className="hidden md:inline text-[10px] text-gray-500">
              Press ? to toggle
            </span>
          </div>

          {/* Mobile Touch instructions */}
          <div className="md:hidden space-y-2 text-[11px]">
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-2.5">
              <p className="text-purple-300 font-semibold tracking-wide flex items-center gap-1.5">
                <span>🕹️</span> MOVEMENT
              </p>
              <p className="mt-1 text-gray-400 leading-relaxed">
                Drag the virtual joystick in the bottom-left corner to walk in any direction.
              </p>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-2.5">
              <p className="text-amber-300 font-semibold tracking-wide flex items-center gap-1.5">
                <span>✦</span> INTERACTION
              </p>
              <p className="mt-1 text-gray-400 leading-relaxed">
                Walk near any floating crystal marker, then tap the pulsing <strong>INTERACT</strong> button.
              </p>
            </div>

            <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2.5">
              <p className="text-cyan-300 font-semibold tracking-wide flex items-center gap-1.5">
                <span>💬</span> DIALOGUE & LORE
              </p>
              <p className="mt-1 text-gray-400 leading-relaxed">
                Tap the dialogue box to advance keeper messages and open zone archives.
              </p>
            </div>
          </div>

          {/* Desktop Key Bindings List */}
          <div className="hidden md:block space-y-2 text-[11px]">
            {/* WASD */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-gray-300">Move Avatar</span>
              <div className="flex gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-purple-200 font-bold text-[10px]">
                  WASD
                </kbd>
                <span className="text-gray-500">/</span>
                <kbd className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-purple-200 font-bold text-[10px]">
                  ARROWS
                </kbd>
              </div>
            </div>

            {/* Interact [E] */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-gray-300">Interact / Cutscene</span>
              <kbd className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-200 font-bold text-[10px]">
                E
              </kbd>
            </div>

            {/* Continue Dialogue */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-gray-300">Advance Dialogue</span>
              <div className="flex gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold text-[10px]">
                  SPACE
                </kbd>
                <span className="text-gray-500">/</span>
                <kbd className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold text-[10px]">
                  ENTER
                </kbd>
              </div>
            </div>

            {/* Close Overlay */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
              <span className="text-gray-300">Close Overlay</span>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-500/20 border border-gray-400/40 text-gray-300 font-bold text-[10px]">
                ESC
              </kbd>
            </div>

            {/* Reset Shortcut */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="text-red-300">Reset Realm & Level</span>
              <div className="flex gap-1 text-[9px]">
                <kbd className="px-1 py-0.5 rounded bg-red-500/20 border border-red-400/40 text-red-200 font-bold">
                  CTRL
                </kbd>
                <span>+</span>
                <kbd className="px-1 py-0.5 rounded bg-red-500/20 border border-red-400/40 text-red-200 font-bold">
                  SHIFT
                </kbd>
                <span>+</span>
                <kbd className="px-1 py-0.5 rounded bg-red-500/20 border border-red-400/40 text-red-200 font-bold">
                  R
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
