/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/useGameStore'

const RANKS = ['Wanderer', 'Seeker', 'Arcanist', 'Voidwalker', 'Aethermage']

export default function GameHUD() {
  const { level, currentXP, xpToNextLevel, currentZone, resetGame } = useGameStore()

  const xpPercent = (currentXP / xpToNextLevel) * 100
  const filledSegments = Math.floor(xpPercent / 10)
  const rank = RANKS[Math.min(level - 1, RANKS.length - 1)]

  // --- XP animation tracking ---
  const prevXP = useRef(currentXP)
  const [xpFlash, setXpFlash] = useState(false)

  useEffect(() => {
    if (currentXP > prevXP.current) {
      setXpFlash(true)
      setTimeout(() => setXpFlash(false), 300)
    }
    prevXP.current = currentXP
  }, [currentXP])

  // --- Level up glitch ---
  const prevLevel = useRef(level)
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    if (level > prevLevel.current) {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 250)
    }
    prevLevel.current = level
  }, [level])

  // --- Simple event log ---
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    if (currentZone) {
      setLog((prev) => [`Entered: ${currentZone}`, ...prev].slice(0, 4))
    }
  }, [currentZone])

  // --- Zone signal lock text ---
  const [zoneDisplay, setZoneDisplay] = useState('— void —')

  useEffect(() => {
    if (!currentZone) {
      setZoneDisplay('— void —')
      return
    }

    const steps = ['— scanning —', '…locking…', currentZone]
    let i = 0

    const interval = setInterval(() => {
      setZoneDisplay(steps[i])
      i++
      if (i >= steps.length) clearInterval(interval)
    }, 120)

    return () => clearInterval(interval)
  }, [currentZone])

  // --- Dev mode: Reset button toggled via Ctrl+Shift+R ---
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        setShowReset((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className={`absolute top-4 left-4 text-purple-200 p-4 rounded-lg w-72 font-mono bg-black/70 overflow-hidden ${
        glitch ? 'translate-x-[2px] skew-x-2' : ''
      }`}
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(168,85,247,0.03) 2px,
          rgba(168,85,247,0.03) 4px
        )`,
        animation: 'voidFlicker 6s infinite',
      }}
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500" />

      {/* Header */}
      <div className="mb-2 text-xs opacity-70 tracking-widest">
        SYNAPTIC LINK ESTABLISHED
      </div>

      {/* Rank */}
      <div className="mb-3">
        <div className="text-lg text-purple-400">{rank}</div>
        <div className="text-xs opacity-60">Designation Lv.{level}</div>
      </div>

      {/* XP */}
      <div className="mb-3">
        <div className="text-xs mb-1">
          AETHER CHARGE: {currentXP} / {xpToNextLevel}
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-5 rounded-sm transition-all duration-200 ${
                xpFlash && i < filledSegments ? 'shadow-[0_0_8px_#a855f7]' : ''
              }`}
              style={{
                background: i < filledSegments ? '#a855f7' : '#1e1a3a',
              }}
            />
          ))}
        </div>
      </div>

      {/* Zone */}
      <div className="text-sm mb-3">
        CURRENT ANCHOR:{' '}
        <span className="text-purple-400">
          {zoneDisplay}
        </span>
      </div>

      {/* Event log */}
      <div className="text-[10px] opacity-70 space-y-1 mb-2">
        {log.map((entry, i) => (
          <div key={i} className="truncate">
            {'>'} {entry}
          </div>
        ))}
      </div>

      {/* Reset Button */}
      {showReset && (
        <button
          onClick={() => {
            resetGame();
          }}
          className="pointer-events-auto mt-3 w-full text-center text-[10px] tracking-wider text-purple-400/80 hover:text-purple-300 border border-purple-500/25 hover:border-purple-500/50 bg-purple-950/20 hover:bg-purple-950/40 rounded py-1.5 transition-all cursor-pointer font-mono"
        >
          [ RESET SYSTEM PROGRESS ]
        </button>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes voidFlicker {
          0%, 100% { opacity: 1; }
          98% { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}