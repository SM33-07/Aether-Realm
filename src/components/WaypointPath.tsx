"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";
import { ZONES } from "@/data/zones";

export default function WaypointPath() {
  const visitedZones = useGameStore((s) => s.visitedZones);
  const nearZone = useGameStore((s) => s.nearZone);
  const dialogueActive = useGameStore((s) => s.dialogueActive);
  const cutsceneActive = useGameStore((s) => s.cutsceneActive);

  const groupRef = useRef<THREE.Group>(null!);

  const allUnlocked = visitedZones.length >= ZONES.length;

  // Determine active target zone to draw path towards
  const nextUnvisited = ZONES.find((z) => !visitedZones.includes(z.id));
  const targetZone = nearZone
    ? ZONES.find((z) => z.id === nearZone)
    : nextUnvisited;

  // Animate path pulse effect safely across inner meshes
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.children.forEach((groupNode, idx) => {
      groupNode.children?.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshBasicMaterial;
          const wave = Math.sin(time * 4 - idx * 0.4) * 0.5 + 0.5;
          mat.opacity = 0.2 + wave * 0.6;
        }
      });
    });
  });

  // Hide waypoint path if all zones unlocked or during cutscenes/dialogues
  if (allUnlocked || !targetZone || dialogueActive || cutsceneActive) {
    return null;
  }

  const startPos = new THREE.Vector3(0, 0.04, 0); // Origin / center
  const targetPos = new THREE.Vector3(
    targetZone.position[0],
    0.04,
    targetZone.position[2]
  );

  const numWaypoints = 12;
  const points: THREE.Vector3[] = [];

  for (let i = 1; i <= numWaypoints; i++) {
    const t = i / (numWaypoints + 1);
    points.push(new THREE.Vector3().lerpVectors(startPos, targetPos, t));
  }

  const pathColor = targetZone.color || "#a855f7";

  return (
    <group ref={groupRef}>
      {/* Waypoint Nodes along floor */}
      {points.map((pt, idx) => (
        <group key={idx} position={pt}>
          {/* Floor Ring Node */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08, 0.16, 16]} />
            <meshBasicMaterial
              color={pathColor}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Center Glow Core */}
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
