"use client";

import { useGameStore } from "@/store/useGameStore";
import { Sparkles } from "@react-three/drei";

export default function WorldParticles() {
  const visitedZones = useGameStore((s) => s.visitedZones);
  const count = visitedZones.length;

  if (count === 0) return null;

  return (
    <group>
      {/* 1 Zone: Forge Embers */}
      {count >= 1 && (
        <Sparkles
          count={40}
          scale={[18, 6, 18]}
          size={2.5}
          speed={0.8}
          opacity={0.4}
          color="#f59e0b"
          position={[6, 2, 4]}
        />
      )}

      {/* 2 Zones: Knowledge Cyan Motes */}
      {count >= 2 && (
        <Sparkles
          count={50}
          scale={[18, 6, 18]}
          size={2.2}
          speed={0.7}
          opacity={0.45}
          color="#06b6d4"
          position={[-5, 2, 8]}
        />
      )}

      {/* 3 Zones: Oracle Void Particles */}
      {count >= 3 && (
        <Sparkles
          count={60}
          scale={[20, 8, 20]}
          size={3.0}
          speed={1.0}
          opacity={0.5}
          color="#a855f7"
          position={[-8, 2, -6]}
        />
      )}

      {/* 4 Zones: Realm-wide Celestial Stardust */}
      {count >= 4 && (
        <Sparkles
          count={120}
          scale={[24, 10, 24]}
          size={3.5}
          speed={1.2}
          opacity={0.65}
          color="#ec4899"
          position={[0, 4, 0]}
        />
      )}
    </group>
  );
}
