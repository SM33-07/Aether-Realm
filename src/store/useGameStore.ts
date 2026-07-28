import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InteractionPhase =
  | "idle"
  | "cutscene"
  | "dialogue"
  | "content";

interface GameState {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  visitedZones: string[];
  currentZone: string | null;
  justLeveledUp: boolean;
  dialogueActive: boolean;
  cutsceneActive: boolean;
  gameStarted: boolean;
  nearZone: string | null;
  discoveredZone: string | null;
  interactionPhase: InteractionPhase;
}

interface GameStore extends GameState {
  gainXP: (amount: number) => void;
  visitZone: (zoneId: string) => void;
  setCurrentZone: (zoneId: string | null) => void;
  setDialogueActive: (value: boolean) => void;
  resetLevelUpFlag: () => void;
  resetGame: () => void;
  startGame: () => void;
  setNearZone: (zoneId: string | null) => void;
  interactWithZone: () => void;
  startZoneInteraction: () => void;
  completeZoneCutscene: () => void;
  completeDialogue: () => void;
  closeZoneContent: () => void;
  clearDiscovery: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      level: 1,
      currentXP: 0,
      xpToNextLevel: 100,
      visitedZones: [],
      currentZone: null,
      justLeveledUp: false,
      dialogueActive: false,
      cutsceneActive: false,
      gameStarted: false,
      nearZone: null,
      discoveredZone: null,
      interactionPhase: "idle",

      gainXP: (amount) => {
        const { currentXP, xpToNextLevel, level } = get();
        const newXP = currentXP + amount;

        if (newXP >= xpToNextLevel) {
          set({
            level: level + 1,
            currentXP: newXP - xpToNextLevel,
            xpToNextLevel: Math.floor(xpToNextLevel * 1.5),
            justLeveledUp: true,
          });
          return;
        }

        set({ currentXP: newXP });
      },

      visitZone: (zoneId) => {
        set({
          currentZone: zoneId,
          cutsceneActive: true,
          interactionPhase: "cutscene",
          dialogueActive: false,
          discoveredZone: null,
        });
      },

      setCurrentZone: (zoneId) => set({ currentZone: zoneId }),

      setDialogueActive: (value) =>
        set({
          dialogueActive: value,
          cutsceneActive: false,
          interactionPhase: value ? "dialogue" : "content",
        }),

      resetLevelUpFlag: () => set({ justLeveledUp: false }),

      startGame: () => set({ gameStarted: true }),

      setNearZone: (zoneId) => set({ nearZone: zoneId }),

      interactWithZone: () => get().startZoneInteraction(),

      startZoneInteraction: () => {
        const { nearZone, interactionPhase } = get();
        if (!nearZone || interactionPhase !== "idle") return;

        const firstVisit = !get().visitedZones.includes(nearZone);

        set({
          currentZone: nearZone,
          cutsceneActive: true,
          interactionPhase: "cutscene",
          dialogueActive: false,
          discoveredZone: firstVisit ? nearZone : null,
        });
      },

      completeZoneCutscene: () => {
        const { currentZone, interactionPhase, visitedZones } = get();
        if (!currentZone || interactionPhase !== "cutscene") return;

        const firstVisit = !visitedZones.includes(currentZone);

        set({
          visitedZones: firstVisit
            ? [...visitedZones, currentZone]
            : visitedZones,
          cutsceneActive: false,
          dialogueActive: true,
          interactionPhase: "dialogue",
          discoveredZone: null,
        });

        if (firstVisit) get().gainXP(50);
      },

      completeDialogue: () => {
        set({
          dialogueActive: false,
          cutsceneActive: false,
          interactionPhase: "content",
        });
      },

      closeZoneContent: () => {
        set({
          currentZone: null,
          interactionPhase: "idle",
          dialogueActive: false,
          cutsceneActive: false,
        });
      },

      clearDiscovery: () => set({ discoveredZone: null }),

      resetGame: () => {
        set({
          level: 1,
          currentXP: 0,
          xpToNextLevel: 100,
          visitedZones: [],
          currentZone: null,
          justLeveledUp: false,
          dialogueActive: false,
          cutsceneActive: false,
          gameStarted: false,
          nearZone: null,
          discoveredZone: null,
          interactionPhase: "idle",
        });

        localStorage.removeItem("aether-realm-save");
      },
    }),
    {
      name: "aether-realm-save",
      partialize: (state) => ({
        level: state.level,
        currentXP: state.currentXP,
        xpToNextLevel: state.xpToNextLevel,
        visitedZones: state.visitedZones,
      }),
    }
  )
);
