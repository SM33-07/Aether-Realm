'use client'

import { useGameStore } from '@/store/useGameStore'
import { ZONES } from '@/data/zones'
import { KEEPER_DIALOGUES } from '@/data/dialogue'

export default function ZoneTagsOverlay() {
  const gameStarted = useGameStore((s) => s.gameStarted)
  const visitedZones = useGameStore((s) => s.visitedZones)
  const dialogueActive = useGameStore((s) => s.dialogueActive)
  const cutsceneActive = useGameStore((s) => s.cutsceneActive)

  if (!gameStarted || dialogueActive || cutsceneActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {ZONES.map((zone) => {
        const isVisited = visitedZones.includes(zone.id)
        const keeper = KEEPER_DIALOGUES[zone.id]

        return (
          <div
            key={zone.id}
            id={`zone-tag-${zone.id}`}
            className="absolute top-0 left-0 transition-opacity duration-300 select-none"
            style={{
              transform: 'translate(-50%, -100%) translate3d(-9999px, -9999px, 0)',
              willChange: 'transform',
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#09090f]/90 border backdrop-blur-md font-mono text-xs whitespace-nowrap shadow-xl"
              style={{
                borderColor: zone.color + '80',
                boxShadow: `0 0 16px ${zone.color}35`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: zone.color }}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-widest uppercase" style={{ color: zone.color }}>
                    {zone.name}
                  </span>
                  {isVisited && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-sans border border-emerald-500/40">
                      ✓ RESTORED
                    </span>
                  )}
                </div>
                {keeper && (
                  <span className="text-[10px] text-gray-400 font-sans tracking-wide">
                    {keeper.name} — {keeper.title}
                  </span>
                )}
              </div>
            </div>
            {/* Pointer triangle */}
            <div
              className="w-2 h-2 rotate-45 mx-auto -mt-1 border-r border-b"
              style={{
                backgroundColor: '#09090f',
                borderColor: zone.color + '80',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
