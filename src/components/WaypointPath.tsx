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

  // Determine active target zone to draw path towards
  const nextUnvisited = ZONES.find((z) => !visitedZones.includes(z.id));
  const targetZone = nearZone
    ? ZONES.find((z) => z.id === nearZone)
    : nextUnvisited || ZONES[0];

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

  if (!targetZone || dialogueActive || cutsceneActive) return null;

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
        <group key={idx} position={[pt.x, pt.y, pt.z]}>
          {/* Ground Ring Node */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08 + (idx / numWaypoints) * 0.05, 0.16 + (idx / numWaypoints) * 0.05, 16]} />
            <meshBasicMaterial
              color={pathColor}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Core Spark dot */}
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              color={pathColor}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Target Floor Destination Ring */}
      <group position={[targetPos.x, 0.03, targetPos.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.35, 32]} />
          <meshBasicMaterial
            color={pathColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
