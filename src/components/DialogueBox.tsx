'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { useGameStore } from '@/store/useGameStore'
import { KEEPER_DIALOGUES } from '@/data/dialogue'

export default function DialogueBox() {
  const currentZone =
    useGameStore(
      (s) => s.currentZone
    )

  const dialogueActive =
    useGameStore(
      (s) => s.dialogueActive
    )

  const completeDialogue =
    useGameStore(
      (s) =>
        s.completeDialogue
    )

  const [lineIndex, setLineIndex] =
    useState(0)

  const [displayed, setDisplayed] =
    useState('')

  const [isTyping, setIsTyping] =
    useState(false)

  const charIndexRef =
    useRef(0)

  const keeper =
    currentZone
      ? KEEPER_DIALOGUES[
          currentZone
        ]
      : null

  useEffect(() => {
    setLineIndex(0)
    setDisplayed('')
    charIndexRef.current = 0
    setIsTyping(false)
  }, [currentZone])

  useEffect(() => {
    if (
      !keeper ||
      !dialogueActive
    )
      return

    const fullText =
      keeper.lines[lineIndex]

    charIndexRef.current = 0
    setDisplayed('')
    setIsTyping(true)

    const interval =
      setInterval(() => {
        charIndexRef.current++

        setDisplayed(
          fullText.slice(
            0,
            charIndexRef.current
          )
        )

        if (
          charIndexRef.current >=
          fullText.length
        ) {
          clearInterval(
            interval
          )
          setIsTyping(false)
        }
      }, 28)

    return () => {
      clearInterval(interval)
    }
  }, [
    lineIndex,
    keeper,
    dialogueActive,
  ])

  const handleAdvance =
    () => {
      if (!keeper) return

      const fullText =
        keeper.lines[lineIndex]

      if (
        displayed.length <
        fullText.length
      ) {
        setDisplayed(fullText)
        charIndexRef.current =
          fullText.length
        setIsTyping(false)
        return
      }

      if (
        lineIndex <
        keeper.lines.length - 1
      ) {
        setLineIndex(
          (prev) => prev + 1
        )
      } else {
        completeDialogue()
      }
    }

  useEffect(() => {
    const onKey = (
      e: KeyboardEvent
    ) => {
      if (
        dialogueActive &&
        (e.key === ' ' || e.key === 'Enter')
      ) {
        handleAdvance()
      }
    }

    window.addEventListener(
      'keydown',
      onKey
    )

    return () =>
      window.removeEventListener(
        'keydown',
        onKey
      )
  }, [
    displayed,
    lineIndex,
    keeper,
    dialogueActive,
  ])

  if (
    !keeper ||
    !dialogueActive
  )
    return null

  return (
    <div
      onClick={handleAdvance}
      className="absolute bottom-6 left-1/2 w-[720px] max-w-[92vw] pointer-events-auto cursor-pointer z-50"
      style={{
        animation:
          'dialogueEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div
        className="relative bg-[#09090f]/95 backdrop-blur-md border rounded-2xl pt-5 pb-6 px-8 overflow-hidden"
        style={{
          borderColor:
            keeper.color + '40',
          boxShadow: `0 0 30px ${keeper.color}15, 0 0 60px ${keeper.color}08`,
        }}
      >
        {/* Corner brackets */}
        <div
          className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
          style={{
            borderColor:
              keeper.color + '60',
          }}
        />
        <div
          className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
          style={{
            borderColor:
              keeper.color + '60',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
          style={{
            borderColor:
              keeper.color + '60',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
          style={{
            borderColor:
              keeper.color + '60',
          }}
        />

        {/* Header: Name + Title */}
        <div className="flex items-baseline gap-3 mb-4">
          <h3
            className="text-lg font-bold"
            style={{
              color:
                keeper.color,
            }}
          >
            {keeper.name}
          </h3>

          <span className="text-xs text-gray-500">
            {keeper.title}
          </span>
        </div>

        {/* Dialogue text with typewriter cursor */}
        <p className="text-white/90 text-[15px] leading-loose min-h-[4.5rem]">
          {displayed}
          {isTyping && (
            <span
              className="animate-blink ml-[1px]"
              style={{
                color:
                  keeper.color,
              }}
            >
              ▋
            </span>
          )}
        </p>

        {/* Footer hint */}
        <div className="flex justify-end mt-4">
          <span
            className="text-[10px] tracking-[0.2em] uppercase font-mono"
            style={{
              color:
                keeper.color + '80',
            }}
          >
            SPACE{' '}
            <span className="text-xs">
              ▸
            </span>{' '}
            Continue
          </span>
        </div>
      </div>
    </div>
  )
}


