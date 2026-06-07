"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from '@react-three/drei'
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";

type CrystalShape =
  | "torusKnot"
  | "icosahedron"
  | "dodecahedron"
  | "torus";

type AetherCrystalProps = {
  id: string;
  position: [number, number, number];
  color?: string;
  shape?: CrystalShape;
};

function ZoneGeometry({
  shape,
}: {
  shape?: CrystalShape;
}) {
  switch (shape) {
    case "torusKnot":
      return (
        <torusKnotGeometry
          args={[0.5, 0.18, 100, 16]}
        />
      );

    case "icosahedron":
      return (
        <icosahedronGeometry
          args={[0.7, 0]}
        />
      );

    case "dodecahedron":
      return (
        <dodecahedronGeometry
          args={[0.7, 0]}
        />
      );

    case "torus":
      return (
        <torusGeometry
          args={[0.6, 0.22, 16, 32]}
        />
      );

    default:
      return (
        <octahedronGeometry
          args={[0.7, 0]}
        />
      );
  }
}

export default function AetherCrystal({
  id,
  position,
  color = "#a855f7",
  shape,
}: AetherCrystalProps) {
  const groupRef =
    useRef<THREE.Group>(null!);

  const isVisited = useGameStore((state) =>
    state.visitedZones.includes(id)
  );

  useFrame((_, delta) => {
    if (isVisited) {
      groupRef.current.rotation.y +=
        delta * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Glow */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isVisited ? 0.12 : 0.02}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Sparkles */}
      {isVisited && (
        <Sparkles
          count={50}
          scale={3}
          size={1.5}
          speed={3}
          opacity={0.6}
          color={color}
          position={[0, 1, 0]}
        />
      )}

      {/* Rotating Geometry Container */}
      <group
        ref={groupRef}
        position={[0, 1, 0]}
      >
        {/* Solid Mesh */}
        <mesh>
          <ZoneGeometry
            shape={shape}
          />

          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isVisited ? 0.8 : 0.1}
            roughness={0.15}
            metalness={0.8}
          />
        </mesh>

        {/* Wireframe Overlay */}
        <mesh>
          <ZoneGeometry
            shape={shape}
          />

          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={isVisited ? 0.18 : 0.04}
          />
        </mesh>
      </group>
    </group>
  );
}