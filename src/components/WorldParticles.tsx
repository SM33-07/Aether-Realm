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
          count={18}
          scale={[14, 5, 14]}
          size={1.8}
          speed={0.6}
          opacity={0.25}
          color="#f59e0b"
          position={[6, 2, 4]}
        />
      )}

      {/* 2 Zones: Knowledge Cyan Motes */}
      {count >= 2 && (
        <Sparkles
          count={20}
          scale={[14, 5, 14]}
          size={1.6}
          speed={0.5}
          opacity={0.25}
          color="#06b6d4"
          position={[-5, 2, 8]}
        />
      )}

      {/* 3 Zones: Oracle Void Particles */}
      {count >= 3 && (
        <Sparkles
          count={22}
          scale={[16, 6, 16]}
          size={2.0}
          speed={0.7}
          opacity={0.3}
          color="#a855f7"
          position={[-8, 2, -6]}
        />
      )}

      {/* 4 Zones: Subtle Pink Stardust */}
      {count >= 4 && (
        <Sparkles
          count={25}
          scale={[18, 6, 18]}
          size={1.8}
          speed={0.6}
          opacity={0.2}
          color="#ec4899"
          position={[0, 3, 0]}
        />
      )}
    </group>
  );
}
