"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { KEEPER_DIALOGUES } from "@/data/dialogue";
import { playSfx } from "@/lib/audioManager";

export default function DialogueBox() {
  const currentZone = useGameStore((s) => s.currentZone);
  const dialogueActive = useGameStore((s) => s.dialogueActive);
  const completeDialogue = useGameStore((s) => s.completeDialogue);

  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const charIndexRef = useRef(0);
  const lastAdvanceTimeRef = useRef(0);

  const keeper = currentZone ? KEEPER_DIALOGUES[currentZone] : null;

  useEffect(() => {
    setLineIndex(0);
    setDisplayed("");
    charIndexRef.current = 0;
    setIsTyping(false);
  }, [currentZone]);

  useEffect(() => {
    if (!keeper || !dialogueActive) return;

    const fullText = keeper.lines[lineIndex];
    charIndexRef.current = 0;
    setDisplayed("");
    setIsTyping(true);

    const interval = setInterval(() => {
      charIndexRef.current++;
      setDisplayed(fullText.slice(0, charIndexRef.current));

      if (charIndexRef.current % 4 === 0) {
        playSfx("dialogue");
      }

      if (charIndexRef.current >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);

    return () => {
      clearInterval(interval);
    };
  }, [lineIndex, keeper, dialogueActive]);

  const handleAdvance = () => {
    if (!keeper) return;

    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 250) return; // Prevent duplicate rapid taps
    lastAdvanceTimeRef.current = now;

    const fullText = keeper.lines[lineIndex];

    if (displayed.length < fullText.length) {
      setDisplayed(fullText);
      charIndexRef.current = fullText.length;
      setIsTyping(false);
      return;
    }

    if (lineIndex < keeper.lines.length - 1) {
      playSfx("click");
      setLineIndex((prev) => prev + 1);
    } else {
      playSfx("interact");
      completeDialogue();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (dialogueActive && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [displayed, lineIndex, keeper, dialogueActive]);

  if (!keeper || !dialogueActive) return null;

  return (
    <div
      onClick={handleAdvance}
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] inset-x-0 mx-auto w-[calc(100vw-1.5rem)] sm:w-[720px] max-w-[720px] max-h-[46dvh] overflow-y-auto pointer-events-auto cursor-pointer z-50 touch-manipulation select-none"
      style={{
        animation: "dialogueEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <div
        className="relative bg-[#09090f]/95 backdrop-blur-xl border rounded-2xl pt-3.5 pb-3.5 px-4 sm:pt-5 sm:pb-6 sm:px-8 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
        style={{
          borderColor: keeper.color + "50",
          boxShadow: `0 0 30px ${keeper.color}20, 0 0 60px ${keeper.color}10`,
        }}
      >
        {/* Corner brackets */}
        <div
          className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
          style={{ borderColor: keeper.color + "70" }}
        />
        <div
          className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
          style={{ borderColor: keeper.color + "70" }}
        />
        <div
          className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
          style={{ borderColor: keeper.color + "70" }}
        />
        <div
          className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
          style={{ borderColor: keeper.color + "70" }}
        />

        {/* Header: Name + Title */}
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 mb-2 sm:mb-3">
          <h3
            className="text-base sm:text-lg font-bold font-mono tracking-wide"
            style={{ color: keeper.color }}
          >
            {keeper.name}
          </h3>
          <span className="text-[11px] sm:text-xs text-gray-500 font-mono">
            // {keeper.title}
          </span>
        </div>

        {/* Dialogue text */}
        <p className="text-white/95 text-xs sm:text-[15px] leading-relaxed sm:leading-loose min-h-[2.5rem] sm:min-h-[4rem] whitespace-pre-wrap break-words font-sans">
          {displayed}
          {isTyping && (
            <span
              className="animate-blink ml-[2px] font-mono font-bold"
              style={{ color: keeper.color }}
            >
              ▋
            </span>
          )}
        </p>

        {/* Footer hint */}
        <div className="flex justify-between items-center mt-2.5 sm:mt-4 pt-2 border-t border-white/10 font-mono text-[9px] sm:text-[10px]">
          <span className="text-gray-500">
            TRANSMISSION {lineIndex + 1}/{keeper.lines.length}
          </span>
          <span
            className="tracking-[0.15em] uppercase font-semibold"
            style={{ color: keeper.color }}
          >
            <span className="sm:hidden">TAP TO CONTINUE ▸</span>
            <span className="hidden sm:inline">
              SPACE / ENTER <span className="text-xs">▸</span> Continue
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
