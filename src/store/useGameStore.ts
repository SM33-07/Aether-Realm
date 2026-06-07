import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  level: number;
  currentXP: number;
  xpToNextLevel: number;

  // Array instead of Set
  visitedZones: string[];

  currentZone: string | null;
}

interface GameStore extends GameState {
  gainXP: (amount: number) => void;

  visitZone: (
    zoneId: string
  ) => void;

  setCurrentZone: (
    zoneId: string | null
  ) => void;

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

        resetGame: () => {
          set({
            level: 1,
            currentXP: 0,
            xpToNextLevel: 100,
            visitedZones: [],
            currentZone: null,
          });
        },

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

          if (
            !alreadyVisited
          ) {
            set({
              visitedZones: [
                ...visitedZones,
                zoneId,
              ],

              currentZone:
                zoneId,
            });

            gainXP(30);
          } else {
            set({
              currentZone:
                zoneId,
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