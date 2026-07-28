'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/useGameStore'

export default function CutsceneOverlay() {
  const cutsceneActive = useGameStore((s) => s.cutsceneActive)
  const completeZoneCutscene = useGameStore((s) => s.completeZoneCutscene)

  useEffect(() => {
    if (!cutsceneActive) return

    const timer = setTimeout(() => {
      completeZoneCutscene()
    }, 1800)

    return () => clearTimeout(timer)
  }, [cutsceneActive, completeZoneCutscene])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[80] flex flex-col justify-between transition-all duration-700"
      style={{
        opacity: cutsceneActive ? 1 : 0,
      }}
    >
      {/* Top Letterbox Bar */}
      <div
        className="w-full bg-black transition-transform duration-700 ease-out flex items-center justify-center border-b border-purple-500/20"
        style={{
          height: '64px',
          transform: cutsceneActive ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-purple-400/80 animate-pulse">
          — REALM SYNAPSE FOCUS —
        </span>
      </div>

      {/* Bottom Letterbox Bar */}
      <div
        className="w-full bg-black transition-transform duration-700 ease-out flex items-center justify-center border-t border-purple-500/20"
        style={{
          height: '64px',
          transform: cutsceneActive ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-purple-400/60">
          AETHER SYSTEM REVEAL
        </span>
      </div>
    </div>
  )
}
