'use client'
import dynamic from 'next/dynamic'
import GameHUD from '@/components/GameHUD'
import ZonePanel from '@/components/ZonePanel'
import DialogueBox from '@/components/DialogueBox'

const Scene = dynamic(
  () => import('@/components/Scene'),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="relative w-screen h-screen">
      <Scene />
      <GameHUD />
      <DialogueBox />
      <ZonePanel />
    </main>
  )
}