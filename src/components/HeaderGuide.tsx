'use client'

import { useGameStore } from '@/store/useGameStore'
import { ZONES } from '@/data/zones'

export default function HeaderGuide() {
  const gameStarted = useGameStore((s) => s.gameStarted)
  const visitedZones = useGameStore((s) => s.visitedZones)
  const nearZone = useGameStore((s) => s.nearZone)
  const dialogueActive = useGameStore((s) => s.dialogueActive)
  const cutsceneActive = useGameStore((s) => s.cutsceneActive)

  if (!gameStarted || dialogueActive || cutsceneActive) return null

  // Find next target zone to guide the player towards
  const nextUnvisited = ZONES.find((z) => !visitedZones.includes(z.id))
  const targetZone = nearZone
    ? ZONES.find((z) => z.id === nearZone)
    : nextUnvisited || ZONES[0]

  const isNear = !!nearZone
  const allVisited = visitedZones.length === ZONES.length

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-auto max-w-[90vw]">
      <div
        className="flex items-center gap-3 bg-[#09090f]/90 backdrop-blur-md border border-purple-500/30 px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.15)] font-mono text-xs text-purple-200 transition-all duration-300"
        style={{
          borderColor: isNear && targetZone ? targetZone.color + '80' : undefined,
          boxShadow: isNear && targetZone ? `0 0 25px ${targetZone.color}30` : undefined,
        }}
      >
        {/* Pulsing indicator icon */}
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/40 animate-pulse">
          <span className="text-[10px] text-purple-300 font-bold">▶</span>
        </div>

        {/* Dynamic Instruction */}
        <div className="flex items-center gap-2 flex-wrap">
          {allVisited ? (
            <span className="text-emerald-400 font-semibold tracking-wide">
              ✦ ALL REGIONS UNLOCKED — Free exploration active
            </span>
          ) : isNear ? (
            <>
              <span className="text-gray-300">Approach completed. Press</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/30 border border-purple-400/60 font-bold text-white shadow-[0_0_8px_rgba(168,85,247,0.4)] animate-bounce">
                E
              </span>
              <span className="text-gray-300">
                to interact with{' '}
                <strong style={{ color: targetZone?.color }}>
                  {targetZone?.name}
                </strong>
              </span>
            </>
          ) : (
            <>
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-semibold text-purple-400">
                MISSION:
              </span>
              <span className="text-gray-200">Walk towards</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold text-[11px]">
                WASD
              </span>
              <span className="text-gray-400">or</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold text-[11px]">
                ARROWS
              </span>
              <span className="text-gray-200">➔ approach</span>
              <span
                className="font-bold underline underline-offset-4"
                style={{ color: targetZone?.color || '#a855f7' }}
              >
                {targetZone?.name}
              </span>
              <span className="text-gray-200">& press</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/50 font-bold text-purple-200">
                E
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
