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

  const setDialogueActive =
    useGameStore(
      (s) =>
        s.setDialogueActive
    )

  const [lineIndex, setLineIndex] =
    useState(0)

  const [displayed, setDisplayed] =
    useState('')

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
        }
      }, 28)

    return () =>
      clearInterval(interval)
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
        setDialogueActive(false)
      }
    }

  useEffect(() => {
    const onKey = (
      e: KeyboardEvent
    ) => {
      if (
        e.key === ' ' ||
        e.key === 'Enter'
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
  ])

  if (
    !keeper ||
    !dialogueActive
  )
    return null

  return (
    <div
      onClick={handleAdvance}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[720px] max-w-[92vw] pointer-events-auto cursor-pointer z-50"
    >
      <div
        className="bg-[#09090f]/95 backdrop-blur-md border rounded-2xl p-6"
        style={{
          borderColor:
            keeper.color + '40',
        }}
      >
        <div className="flex items-baseline gap-3 mb-3">
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

        <p className="text-white/90 text-sm leading-relaxed min-h-[3rem]">
          {displayed}
        </p>

        <div className="flex justify-end mt-3">
          <span className="text-xs text-gray-500 font-mono animate-pulse">
            ▶ Click or press
            Space
          </span>
        </div>
      </div>
    </div>
  )
}