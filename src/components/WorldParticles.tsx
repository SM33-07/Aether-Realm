"use client";

import { useGameStore } from "@/store/useGameStore";
import { Sparkles } from "@react-three/drei";

export default function WorldParticles() {
  const visitedZones = useGameStore((s) => s.visitedZones);

  const hasForge = visitedZones.includes("the-forge");
  const hasArchives = visitedZones.includes("the-archives");
  const hasOracle = visitedZones.includes("the-oracle");
  const hasGateway = visitedZones.includes("the-gateway");

  return (
    <group>
      {/* ===================================================
          1. THE FORGE — Amber Gold Particle Block
         =================================================== */}
      <Sparkles
        count={hasForge ? 75 : 15}
        scale={hasForge ? [10, 6, 10] : [4, 3, 4]}
        size={hasForge ? 3.5 : 1.8}
        speed={hasForge ? 1.2 : 0.5}
        opacity={hasForge ? 0.65 : 0.2}
        color="#f59e0b"
        position={[6, 2, 4]}
      />

      {/* ===================================================
          2. THE ARCHIVES — Arcane Cyan Particle Block
         =================================================== */}
      <Sparkles
        count={hasArchives ? 75 : 15}
        scale={hasArchives ? [10, 6, 10] : [4, 3, 4]}
        size={hasArchives ? 3.5 : 1.8}
        speed={hasArchives ? 1.2 : 0.5}
        opacity={hasArchives ? 0.65 : 0.2}
        color="#06b6d4"
        position={[-5, 2, 8]}
      />

      {/* ===================================================
          3. THE ORACLE — Deep Void Violet Particle Block
         =================================================== */}
      <Sparkles
        count={hasOracle ? 80 : 15}
        scale={hasOracle ? [10, 6, 10] : [4, 3, 4]}
        size={hasOracle ? 3.5 : 1.8}
        speed={hasOracle ? 1.2 : 0.5}
        opacity={hasOracle ? 0.65 : 0.2}
        color="#8b5cf6"
        position={[-8, 2, -6]}
      />

      {/* ===================================================
          4. THE GATEWAY — Celestial Pink Particle Block
         =================================================== */}
      <Sparkles
        count={hasGateway ? 85 : 15}
        scale={hasGateway ? [10, 6, 10] : [4, 3, 4]}
        size={hasGateway ? 3.5 : 1.8}
        speed={hasGateway ? 1.2 : 0.5}
        opacity={hasGateway ? 0.65 : 0.2}
        color="#ec4899"
        position={[7, 2, -5]}
      />
    </group>
  );
}
