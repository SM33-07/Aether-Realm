'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/useGameStore'

const UNLOCK_REWARDS: Record<string, { title: string; desc: string; color: string }> = {
  'the-forge': {
    title: 'GOLDEN ARTIFICER CROWN UNLOCKED',
    desc: 'The Forge grants you the golden floating crown & shoulder crystal.',
    color: '#f59e0b',
  },
  'the-archives': {
    title: 'ORBITING KNOWLEDGE RELIC UNLOCKED',
    desc: 'The Archives bestow an orbiting cyan crystal relic & knowledge sparks.',
    color: '#06b6d4',
  },
  'the-oracle': {
    title: 'SWIRLING VOID AURA UNLOCKED',
    desc: 'The Oracle surrounds your form with a deep violet void energy aura.',
    color: '#8b5cf6',
  },
  'the-gateway': {
    title: 'CELESTIAL ARCANE MOTES UNLOCKED',
    desc: 'The Gateway unleashes celestial pink energy motes around your Wanderer.',
    color: '#ec4899',
  },
}

export default function UnlockNotification() {
  const visitedZones = useGameStore((s) => s.visitedZones)
  const [activeUnlock, setActiveUnlock] = useState<{
    title: string
    desc: string
    color: string
  } | null>(null)

  useEffect(() => {
    if (visitedZones.length === 0) return
    const lastZone = visitedZones[visitedZones.length - 1]
    const reward = UNLOCK_REWARDS[lastZone]
    if (reward) {
      setActiveUnlock(reward)
      const timer = setTimeout(() => setActiveUnlock(null), 4500)
      return () => clearTimeout(timer)
    }
  }, [visitedZones])

  if (!activeUnlock) return null

  return (
    <div
      style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none"
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#09090f]/95 border backdrop-blur-xl shadow-2xl font-mono text-xs text-white"
        style={{
          borderColor: activeUnlock.color + '80',
          boxShadow: `0 0 30px ${activeUnlock.color}40`,
        }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm"
          style={{ backgroundColor: activeUnlock.color + '30', color: activeUnlock.color }}
        >
          ✦
        </div>
        <div>
          <div className="font-bold tracking-wider" style={{ color: activeUnlock.color }}>
            {activeUnlock.title}
          </div>
          <div className="text-[11px] text-gray-300 font-sans mt-0.5">{activeUnlock.desc}</div>
        </div>
      </div>
    </div>
  )
}
