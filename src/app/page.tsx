"use client";

import dynamic from "next/dynamic";
import DialogueBox from "@/components/DialogueBox";
import GameHUD from "@/components/GameHUD";
import HeaderGuide from "@/components/HeaderGuide";
import InteractionPrompt from "@/components/InteractionPrompt";
import LandingScreen from "@/components/LandingScreen";
import ZoneDiscovery from "@/components/ZoneDiscovery";
import CutsceneOverlay from "@/components/CutsceneOverlay";
import ZoneTagsOverlay from "@/components/ZoneTagsOverlay";
import ZonePanel from "@/components/ZonePanel";
import { useGameStore } from "@/store/useGameStore";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Page() {
  const gameStarted = useGameStore((state) => state.gameStarted);
  const interactionPhase = useGameStore((state) => state.interactionPhase);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#050508]">
      <LandingScreen />
      {gameStarted && <Scene />}

      {gameStarted && (
        <>
          <div
            className={`pointer-events-none absolute inset-0 z-40 bg-black transition-opacity duration-300 ${
              interactionPhase === "cutscene" || interactionPhase === "dialogue"
                ? "opacity-30"
                : "opacity-0"
            }`}
          />
          <HeaderGuide />
          <GameHUD />
          <InteractionPrompt />
          <CutsceneOverlay />
          <ZoneTagsOverlay />
          <ZoneDiscovery />
          <DialogueBox />
          <ZonePanel />
        </>
      )}
    </main>
  );
}
