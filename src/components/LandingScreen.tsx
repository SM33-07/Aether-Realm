'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/useGameStore'

type Phase =
  | 'void'
  | 'crystal'
  | 'title'
  | 'lore'
  | 'ready'
  | 'fadeout'

export default function LandingScreen() {
  const gameStarted = useGameStore((s) => s.gameStarted)
  const startGame = useGameStore((s) => s.startGame)

  const [phase, setPhase] = useState<Phase>('void')

  /* Auto-advance through cinematic phases */
  useEffect(() => {
    if (gameStarted) return

    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setPhase('crystal'), 500))
    timers.push(setTimeout(() => setPhase('title'), 1800))
    timers.push(setTimeout(() => setPhase('lore'), 3200))
    timers.push(setTimeout(() => setPhase('ready'), 5500))

    return () => timers.forEach(clearTimeout)
  }, [gameStarted])

  /* Listen for Enter / Space to start */
  useEffect(() => {
    if (gameStarted || phase !== 'ready') return

    const handleStart = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setPhase('fadeout')
        setTimeout(() => startGame(), 600)
      }
    }

    window.addEventListener('keydown', handleStart)
    return () => window.removeEventListener('keydown', handleStart)
  }, [gameStarted, phase, startGame])

  const handleClick = () => {
    if (phase === 'ready') {
      setPhase('fadeout')
      setTimeout(() => startGame(), 600)
    }
  }

  if (gameStarted) return null

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#04030a] cursor-pointer select-none"
      style={{
        opacity: phase === 'fadeout' ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139, 92, 246, 0.03) 2px,
            rgba(139, 92, 246, 0.03) 4px
          )`,
        }}
      />

      {/* Void Crystal Icon */}
      <div
        className="relative mb-10 flex items-center justify-center"
        style={{
          opacity: phase !== 'void' ? 1 : 0,
          transform: phase !== 'void' ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Outer Glow Halo */}
        <div
          className="absolute w-24 h-24 rounded-full blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6), rgba(6, 182, 212, 0.3), transparent)',
          }}
        />

        {/* Upright Octahedral Void Crystal */}
        <div className="relative w-16 h-20 flex items-center justify-center">
          {/* Top Prism Facet */}
          <div
            className="absolute top-0 w-16 h-10"
            style={{
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(180deg, #c084fc 0%, #7e22ce 100%)',
            }}
          />
          {/* Bottom Prism Facet */}
          <div
            className="absolute bottom-0 w-16 h-10"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: 'linear-gradient(180deg, #06b6d4 0%, #3b82f6 100%)',
            }}
          />
          {/* Center Void Energy Core */}
          <div
            className="absolute w-8 h-8 rotate-45 border border-white/40 shadow-[0_0_20px_#a855f7]"
            style={{
              background: 'radial-gradient(circle, #ffffff 0%, #a855f7 70%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-4xl md:text-6xl font-bold tracking-[0.3em] mb-4 font-mono"
        style={{
          opacity: ['title', 'lore', 'ready', 'fadeout'].includes(phase) ? 1 : 0,
          transform: ['title', 'lore', 'ready', 'fadeout'].includes(phase)
            ? 'translateY(0)'
            : 'translateY(12px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'linear-gradient(135deg, #c084fc, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        AETHER REALM
      </h1>

      {/* Subtitle */}
      <p
        className="text-sm tracking-[0.15em] text-gray-500 font-mono mb-12"
        style={{
          opacity: ['title', 'lore', 'ready', 'fadeout'].includes(phase) ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}
      >
        A Portfolio by Soham More
      </p>

      {/* Lore text */}
      <p
        className="text-base md:text-lg text-gray-400 font-mono text-center max-w-md px-6 leading-relaxed"
        style={{
          opacity: ['lore', 'ready', 'fadeout'].includes(phase) ? 1 : 0,
          transform: ['lore', 'ready', 'fadeout'].includes(phase)
            ? 'translateY(0)'
            : 'translateY(8px)',
          transition: 'all 0.6s ease',
        }}
      >
        The Crystal has chosen another Architect.
      </p>

      {/* Start prompt */}
      <div
        className="absolute bottom-16"
        style={{
          opacity: phase === 'ready' ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <span
          className="text-sm tracking-[0.2em] uppercase font-mono"
          style={{
            color: 'rgba(139, 92, 246, 0.8)',
            animation: phase === 'ready' ? 'blink 1.5s ease-in-out infinite' : 'none',
          }}
        >
          Press Enter to begin
        </span>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-purple-500/40" />
      <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-purple-500/40" />
      <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-purple-500/40" />
      <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-purple-500/40" />
    </div>
  )
}
