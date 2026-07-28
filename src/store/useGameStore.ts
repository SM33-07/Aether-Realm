import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  visitedZones: string[];
  currentZone: string | null;

  justLeveledUp: boolean;

  dialogueActive: boolean;
}

interface GameStore extends GameState {
  gainXP: (amount: number) => void;

  visitZone: (zoneId: string) => void;

  setCurrentZone: (
    zoneId: string | null
  ) => void;

  setDialogueActive: (
    value: boolean
  ) => void;

  resetLevelUpFlag: () => void;

  resetGame: () => void;
}

export const useGameStore =
  create<GameStore>()(
    persist(
      (set, get) => ({
        level: 1,

        currentXP: 0,

        xpToNextLevel: 100,

        visitedZones: [],

        currentZone: null,

        justLeveledUp: false,

        dialogueActive: false,

        gainXP: (
          amount: number
        ) => {
          const {
            currentXP,
            xpToNextLevel,
            level,
          } = get();

          const newXP =
            currentXP + amount;

          if (
            newXP >=
            xpToNextLevel
          ) {
            const overflow =
              newXP -
              xpToNextLevel;

            set({
              level: level + 1,

              currentXP:
                overflow,

              xpToNextLevel:
                Math.floor(
                  xpToNextLevel *
                  1.5
                ),

              justLeveledUp: true,
            });
          } else {
            set({
              currentXP:
                newXP,
            });
          }
        },

        visitZone: (
          zoneId: string
        ) => {
          const {
            visitedZones,
            gainXP,
          } = get();

          const alreadyVisited =
            visitedZones.includes(
              zoneId
            );

          if (!alreadyVisited) {
            set({
              visitedZones: [
                ...visitedZones,
                zoneId,
              ],

              currentZone: zoneId,

              dialogueActive: true,
            });

            gainXP(30);
          } else {
            set({
              currentZone: zoneId,
            });
          }
        },

        setCurrentZone: (
          zoneId:
            | string
            | null
        ) =>
          set({
            currentZone:
              zoneId,
          }),

        setDialogueActive: (
          value: boolean
        ) =>
          set({
            dialogueActive:
              value,
          }),

        resetLevelUpFlag:
          () =>
            set({
              justLeveledUp: false,
            }),

        resetGame: () => {
          set({
            level: 1,

            currentXP: 0,

            xpToNextLevel: 100,

            visitedZones: [],

            currentZone: null,

            justLeveledUp: false,

            dialogueActive: false,
          });

          localStorage.removeItem(
            "aether-realm-save"
          );
        },
      }),

      {
        name: "aether-realm-save",

        partialize: (
          state
        ) => ({
          level: state.level,

          currentXP:
            state.currentXP,

          xpToNextLevel:
            state.xpToNextLevel,

          visitedZones:
            state.visitedZones,
        }),
      }
    )
  );