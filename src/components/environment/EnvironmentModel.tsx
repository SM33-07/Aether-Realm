"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Clone, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type EnvironmentModelProps = {
  id?: string;
  path: string;
  position: [number, number, number];
  rotationY?: number;
  rotationX?: number;
  rotationZ?: number;
  scale: number;
  isVegetation?: boolean;
};

export default function EnvironmentModel({
  id,
  path,
  position,
  rotationY = 0,
  rotationX = 0,
  rotationZ = 0,
  scale,
  isVegetation = false,
}: EnvironmentModelProps) {
  const { scene } = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);

  // Calculate unique asynchronous phase from world coordinate
  const phase = useMemo(
    () => position[0] * 1.7 + position[2] * 2.3,
    [position]
  );

  // Subtle asynchronous wind sway on vegetation (trees & shrubs)
  useFrame(({ clock }) => {
    if (!isVegetation || !groupRef.current) return;

    // Respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const t = clock.getElapsedTime();
    const swayZ = Math.sin(t * 1.15 + phase) * 0.018;
    const swayX = Math.cos(t * 0.85 + phase) * 0.012;

    groupRef.current.rotation.z = rotationZ + swayZ;
    groupRef.current.rotation.x = rotationX + swayX;
  });

  // Optimize materials, alpha cutouts, LOD levels, and authentic low-poly palette
  useMemo(() => {
    scene.traverse((child) => {
      // 1. Hide redundant overlapping LOD levels on Slavic models to eliminate z-fighting
      if (
        child.name.includes("LOD1") ||
        child.name.includes("LOD2") ||
        child.name.includes("LOD3")
      ) {
        child.visible = false;
      }

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat) return;

        const name = `${mesh.name} ${mat.name} ${path}`.toLowerCase();

        // 2. Alpha-tested foliage: preserve transparent texture while ensuring clean cutout and depth sorting
        if (
          mat.map &&
          (name.includes("foliage") ||
            name.includes("leaves") ||
            name.includes("grass") ||
            name.includes("bush") ||
            name.includes("tree"))
        ) {
          mat.transparent = true;
          mat.alphaTest = 0.08;
          mat.depthWrite = true;
          mat.roughness = 0.82;
          mat.metalness = 0.0;
          mat.side = THREE.DoubleSide;
        }

        // 3. Untextured materials: assign coherent, authentic RPG palette
        if (!mat.map) {
          if (
            name.includes("chest") ||
            name.includes("barrel") ||
            name.includes("bench") ||
            name.includes("fence") ||
            name.includes("wood") ||
            name.includes("table") ||
            name.includes("shed") ||
            name.includes("counter") ||
            name.includes("stool")
          ) {
            mat.color = new THREE.Color("#5a3c26"); // Warm oak timber
            mat.roughness = 0.82;
            mat.metalness = 0.05;
          } else if (
            name.includes("torch") ||
            name.includes("bracket") ||
            name.includes("iron")
          ) {
            mat.color = new THREE.Color("#27292e"); // Dark cast iron
            mat.roughness = 0.55;
            mat.metalness = 0.55;
          } else if (
            name.includes("rock") ||
            name.includes("stone") ||
            name.includes("cobble")
          ) {
            mat.color = new THREE.Color("#56606a"); // Slate riverbed stone
            mat.roughness = 0.88;
            mat.metalness = 0.05;
          } else if (
            name.includes("bush") ||
            name.includes("grass") ||
            name.includes("tree")
          ) {
            mat.color = new THREE.Color("#2d5936"); // Natural muted forest green
            mat.roughness = 0.88;
            mat.metalness = 0.02;
          } else if (
            mat.color &&
            mat.color.r > 0.65 &&
            mat.color.g > 0.65 &&
            mat.color.b > 0.65
          ) {
            mat.color = new THREE.Color("#4a525a"); // Neutral slate
            mat.roughness = 0.85;
          }
        }
      }
    });
  }, [scene, path]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[rotationX, rotationY, rotationZ]}
      scale={scale}
    >
      <Clone object={scene} deep={false} />
    </group>
  );
}
