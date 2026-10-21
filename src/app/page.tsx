"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DialogueBox from "@/components/DialogueBox";
import GameHUD from "@/components/GameHUD";
import HeaderGuide from "@/components/HeaderGuide";
import InteractionPrompt from "@/components/InteractionPrompt";
import LandingScreen from "@/components/LandingScreen";
import ZoneDiscovery from "@/components/ZoneDiscovery";
import CutsceneOverlay from "@/components/CutsceneOverlay";
import ZoneTagsOverlay from "@/components/ZoneTagsOverlay";
import ControlsPalette from "@/components/ControlsPalette";
import UnlockNotification from "@/components/UnlockNotification";
import ZonePanel from "@/components/ZonePanel";
import { useGameStore } from "@/store/useGameStore";
import VirtualJoystick from "@/components/ui/VirtualJoystick";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileInteractButton from "@/components/ui/MobileInteractButton";
import AudioToggle from "@/components/ui/AudioToggle";
import LoadingScreen from "@/components/ui/LoadingScreen";
import CinematicIntro from "@/components/CinematicIntro";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Page() {
  const gameStarted = useGameStore((state) => state.gameStarted);
  const startGame = useGameStore((state) => state.startGame);
  const interactionPhase = useGameStore((state) => state.interactionPhase);
  const isMobile = useIsMobile();

  const [entered, setEntered] = useState(false);
  const [introActive, setIntroActive] = useState(false);

  // URL deep-linking (?zone=the-forge or #the-oracle) & testing support
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { __openZone?: (id: string) => void }).__openZone = (
        zoneId: string
      ) => {
        useGameStore.setState({
          gameStarted: true,
          currentZone: zoneId,
          interactionPhase: "content",
        });
      };

      const handleDeepLink = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const target = searchParams.get("zone") || window.location.hash.replace("#", "");
        if (target && ["the-forge", "the-archives", "the-oracle", "the-gateway"].includes(target)) {
          useGameStore.setState({
            gameStarted: true,
            currentZone: target,
            interactionPhase: "content",
          });
        }
      };

      handleDeepLink();
      window.addEventListener("hashchange", handleDeepLink);
      return () => window.removeEventListener("hashchange", handleDeepLink);
    }
  }, []);

  const handleEnter = () => {
    setEntered(true);
    setIntroActive(true);
  };

  const handleIntroComplete = () => {
    setIntroActive(false);
    startGame();
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden overscroll-none bg-[#050508] select-none">
      {/* 3D Scene is active underneath from the start, showing the crystalline environment */}
      <Scene />

      {/* Stage 1: Loading screen on initial Drei asset load */}
      <LoadingScreen />

      {/* Stage 2: Art-directed Landing / Title Screen */}
      {!entered && !gameStarted && <LandingScreen onEnter={handleEnter} />}

      {/* Stage 3: Cinematic Intro briefing before gameplay */}
      {introActive && !gameStarted && (
        <CinematicIntro onComplete={handleIntroComplete} />
      )}

      {/* Stage 4: In-Game HUD, Controls, and Overlays */}
      {gameStarted && (
        <>
          <AudioToggle />

          <div
            className={`pointer-events-none absolute inset-0 z-40 bg-black transition-opacity duration-300 ${
              interactionPhase === "cutscene" || interactionPhase === "dialogue"
                ? "opacity-35"
                : "opacity-0"
            }`}
          />

          <HeaderGuide />
          <GameHUD />
          <ControlsPalette />
          <UnlockNotification />
          <InteractionPrompt />
          <CutsceneOverlay />
          <ZoneTagsOverlay />
          <ZoneDiscovery />
          <DialogueBox />
          <ZonePanel />
          <MobileInteractButton />

          {isMobile && <VirtualJoystick />}
        </>
      )}
    </main>
  );
}