'use client'

import {
  useEffect,
  useState,
} from 'react'
import { useGameStore } from '@/store/useGameStore'
import { ZONES } from '@/data/zones'

export default function ZoneDiscovery() {
  const discoveredZone =
    useGameStore(
      (s) => s.discoveredZone
    )
  const clearDiscovery =
    useGameStore(
      (s) => s.clearDiscovery
    )

  const [visible, setVisible] =
    useState(false)
  const [phase, setPhase] = useState<
    'enter' | 'show' | 'exit'
  >('enter')

  const zone = ZONES.find(
    (z) => z.id === discoveredZone
  )

  useEffect(() => {
    if (!discoveredZone || !zone) return

    setVisible(true)
    setPhase('enter')

    const t1 = setTimeout(
      () => setPhase('show'),
      100
    )
    const t2 = setTimeout(
      () => setPhase('exit'),
      2200
    )
    const t3 = setTimeout(() => {
      setVisible(false)
      clearDiscovery()
    }, 2800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [
    discoveredZone,
    zone,
    clearDiscovery,
  ])

  if (!visible || !zone) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
      style={{
        opacity:
          phase === 'exit' ? 0 : 1,
        transition:
          'opacity 0.6s ease-out',
      }}
    >
      {/* Subtle backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${zone.color}08 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-3">
        {/* Top decorative line */}
        <div
          className="h-[1px] mb-2"
          style={{
            width:
              phase === 'show'
                ? '200px'
                : '0px',
            background: `linear-gradient(90deg, transparent, ${zone.color}80, transparent)`,
            transition:
              'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* "NEW REGION" label */}
        <span
          className="text-[10px] tracking-[0.4em] uppercase font-mono"
          style={{
            color:
              zone.color + '90',
            opacity:
              phase === 'show'
                ? 1
                : 0,
            transform:
              phase === 'show'
                ? 'translateY(0)'
                : 'translateY(6px)',
            transition:
              'all 0.5s ease 0.1s',
          }}
        >
          — NEW REGION —
        </span>

        {/* Zone name */}
        <h2
          className="text-3xl md:text-5xl font-bold tracking-[0.12em]"
          style={{
            color: zone.color,
            opacity:
              phase === 'show'
                ? 1
                : 0,
            transform:
              phase === 'show'
                ? 'translateY(0) scale(1)'
                : 'translateY(10px) scale(0.95)',
            transition:
              'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            textShadow: `0 0 40px ${zone.color}40`,
          }}
        >
          {zone.name.toUpperCase()}
        </h2>

        {/* Keeper title */}
        <span
          className="text-sm text-gray-400 italic font-mono tracking-wide"
          style={{
            opacity:
              phase === 'show'
                ? 1
                : 0,
            transform:
              phase === 'show'
                ? 'translateY(0)'
                : 'translateY(6px)',
            transition:
              'all 0.5s ease 0.4s',
          }}
        >
          {zone.lore
            .split('.')
            .shift()}
        </span>

        {/* Bottom decorative line */}
        <div
          className="h-[1px] mt-2"
          style={{
            width:
              phase === 'show'
                ? '200px'
                : '0px',
            background: `linear-gradient(90deg, transparent, ${zone.color}80, transparent)`,
            transition:
              'width 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        />
      </div>
    </div>
  )
}
