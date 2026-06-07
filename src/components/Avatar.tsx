/* eslint-disable */
"use client";

import {
  useEffect,
  useRef,
} from "react";

import * as THREE from "three";

import {
  useTexture,
  Sparkles,
  Billboard,
} from "@react-three/drei";

import { useFrame } from "@react-three/fiber";

import { useGameStore } from "@/store/useGameStore";

import {
  useKeyboardMovement,
  Zone,
} from "@/hooks/useKeyboardMovement";

import { useCameraFollow } from "@/hooks/useCameraFollow";

type AvatarProps = {
  zones?: Zone[];
};

const SPRITE_TEXTURES = {
  idle_down: "/sprites/idle_down.png",
  run_down: "/sprites/run_down.png",
  run_left: "/sprites/run_left.png",
  run_right: "/sprites/run_right.png",
  run_up: "/sprites/run_up.png",
};

export default function Avatar({
  zones,
}: AvatarProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  const ringRef =
    useRef<THREE.Mesh>(null);

  const spriteMeshRef =
    useRef<THREE.Mesh>(null!);

  const crownRef =
    useRef<THREE.Group>(null);

  const auraRef =
    useRef<THREE.Mesh>(null);

  const capeRef =
    useRef<THREE.Mesh>(null);

  const directionRef = useRef<
    "up" | "down" | "left" | "right"
  >("down");

  const isMovingRef =
    useRef(false);

  const frameRef = useRef(0);

  const frameTimeRef =
    useRef(0);

  const prevTextureKeyRef =
    useRef("idle_down");

  const tempEulerRef = useRef(new THREE.Euler());
  const tempQuatRef = useRef(new THREE.Quaternion());


  const FPS = 10;
  const FRAME_COUNT = 8;

  const visitedZones = useGameStore(
    (state) => state.visitedZones
  );

  const hasForge = visitedZones.includes("the-forge");
  const hasArchives = visitedZones.includes("the-archives");
  const hasOracle = visitedZones.includes("the-oracle");
  const hasGateway = visitedZones.includes("the-gateway");

  const hasThreeZones = visitedZones.length >= 3;

  const textures = useTexture(SPRITE_TEXTURES);

  useEffect(() => {
    Object.values(textures).forEach((tex) => {
      tex.repeat.set(1 / FRAME_COUNT, -1);
      tex.offset.set(0, 1);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.flipY = false;
      tex.needsUpdate = true;
    });
  }, [textures]);

  useKeyboardMovement(
    groupRef,
    ringRef,
    zones,
    directionRef,
    isMovingRef
  );

  useCameraFollow(groupRef);

  useFrame((state, delta) => {
    frameTimeRef.current += delta;

    if (
      frameTimeRef.current >
      1 / FPS
    ) {
      frameTimeRef.current = 0;

      frameRef.current =
        (frameRef.current + 1) %
        FRAME_COUNT;
    }

    const textureKey =
      isMovingRef.current
        ? `run_${directionRef.current}`
        : "idle_down";

    if (textureKey !== prevTextureKeyRef.current) {
      frameRef.current = 0;
      frameTimeRef.current = 0;
      prevTextureKeyRef.current = textureKey;
    }

    const texture =
      textures[
      textureKey as keyof typeof textures
      ];

    texture.offset.x =
      frameRef.current /
      FRAME_COUNT;

    if (
      spriteMeshRef.current
    ) {
      const material =
        spriteMeshRef.current
          .material as THREE.MeshBasicMaterial;

      material.map =
        texture;

      material.needsUpdate =
        true;
    }

    // Animate crown (Forge reward)
    if (crownRef.current) {
      crownRef.current.rotation.y += delta * 1.0;
      crownRef.current.position.y =
        1.98 + Math.sin(state.clock.elapsedTime * 3) * 0.015;
    }

    // Animate pulsing aura (Oracle reward)
    if (auraRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.06;
      auraRef.current.scale.set(pulse, pulse, pulse);
    }

    // Animate cape (Gateway final form)
    if (capeRef.current) {
      const dir = directionRef.current;
      let targetX = 0;
      let targetZ = -0.06;
      let targetRotX = Math.PI / 12;
      let targetRotY = 0;
      let targetRotZ = 0;

      if (dir === "up") {
        targetX = 0;
        targetZ = 0.06;
        targetRotX = -Math.PI / 12;
        targetRotY = Math.PI;
        targetRotZ = 0;
      } else if (dir === "down") {
        targetX = 0;
        targetZ = -0.06;
        targetRotX = Math.PI / 12;
        targetRotY = 0;
        targetRotZ = 0;
      } else if (dir === "left") {
        targetX = -0.35;
        targetZ = -0.06;
        targetRotX = 0;
        targetRotY = Math.PI / 2;
        targetRotZ = -Math.PI / 10;
      } else if (dir === "right") {
        targetX = 0.35;
        targetZ = -0.06;
        targetRotX = 0;
        targetRotY = -Math.PI / 2;
        targetRotZ = Math.PI / 10;
      }

      // Add dynamic sway/wave animation on top
      const waveX = Math.sin(state.clock.elapsedTime * 4.5) * 0.03;
      const waveY = Math.sin(state.clock.elapsedTime * 2.0) * 0.02;
      const waveZ = Math.sin(state.clock.elapsedTime * 3.0) * 0.015;

      const animatedRotX = targetRotX + waveX;
      const animatedRotY = targetRotY + waveY;
      const animatedRotZ = targetRotZ + waveZ;

      // Smoothly interpolate position
      capeRef.current.position.x = THREE.MathUtils.lerp(capeRef.current.position.x, targetX, 0.15);
      capeRef.current.position.z = THREE.MathUtils.lerp(capeRef.current.position.z, targetZ, 0.15);
      capeRef.current.position.y = 0.5;

      // Smoothly interpolate rotation using Euler/Quaternion refs
      tempEulerRef.current.set(animatedRotX, animatedRotY, animatedRotZ, "YXZ");
      tempQuatRef.current.setFromEuler(tempEulerRef.current);
      capeRef.current.quaternion.slerp(tempQuatRef.current, 0.15);
    }
  });

  return (
    <>
      {/* Avatar Group */}
      <group ref={groupRef}>
        {/* Ground Ring - Lying flat on ground relative to player center */}
        <mesh
          ref={ringRef}
          position={[0, 0.01, 0]}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <ringGeometry
            args={[0.5, 0.7, 32]}
          />
          <meshBasicMaterial
            color="#9333ea"
          />
        </mesh>

        {/* Billboard forces character sprite and aligned effects to face the screen */}
        <Billboard>
          {/* Sprite Mesh */}
          <mesh
            ref={spriteMeshRef}
            position={[0, 1.0, 0]}
          >
            <planeGeometry
              args={[2.0, 1.8]}
            />
            <meshBasicMaterial
              map={textures.idle_down}
              transparent
              alphaTest={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Forge: Crown (glowing orange) */}
          {hasForge && (
            <group ref={crownRef} position={[0, 1.98, 0.02]}>
              {/* Crown Base */}
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.22, 0.03, 8, 24]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  emissive="#f59e0b"
                  emissiveIntensity={1.5}
                />
              </mesh>
              {/* Crown Spikes */}
              {Array.from({ length: 5 }).map((_, index) => {
                const angle = (index / 5) * Math.PI * 2;
                const x = Math.cos(angle) * 0.22;
                const z = Math.sin(angle) * 0.22;
                return (
                  <mesh key={index} position={[x, 0.08, z]}>
                    <coneGeometry args={[0.04, 0.12, 4]} />
                    <meshStandardMaterial
                      color="#f59e0b"
                      emissive="#f59e0b"
                      emissiveIntensity={1.5}
                    />
                  </mesh>
                );
              })}
            </group>
          )}

          {/* Archives: Knowledge Effect (Cyan database particles) */}
          {hasArchives && (
            <Sparkles
              count={30}
              scale={[1.6, 1.6, 1.6]}
              size={1.5}
              speed={1.8}
              opacity={0.7}
              color="#06b6d4"
              position={[0, 1.0, 0]}
            />
          )}

          {/* Oracle: Glowing Pulsing Aura with rich particles */}
          {hasOracle && (
            <group>
              {/* Pulsing ring aura */}
              <mesh ref={auraRef} position={[0, 1.0, -0.05]}>
                <ringGeometry args={[0.7, 0.95, 32]} />
                <meshBasicMaterial
                  color="#8b5cf6"
                  transparent
                  opacity={0.08}
                  blending={THREE.AdditiveBlending}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Orbiting / glowing aura sparkles - Only unlocked after visiting 3+ zones */}
              {hasThreeZones && (
                <Sparkles
                  count={80}
                  scale={[1.3, 1.3, 0.3]}
                  size={2.8}
                  speed={2.2}
                  opacity={0.85}
                  color="#c084fc"
                  position={[0, 1.0, -0.02]}
                />
              )}
            </group>
          )}

          {/* Gateway: Final Form (Aether Cape) */}
          {hasGateway && (
            <mesh
              ref={capeRef}
              position={[0, 0.5, -0.06]}
              rotation={[Math.PI / 12, 0, 0]}
            >
              <cylinderGeometry args={[0.28, 0.55, 1.1, 16, 1, true, Math.PI * 1.2, Math.PI * 0.6]} />
              <meshStandardMaterial
                color="#7f1d1d"
                emissive="#7f1d1d"
                emissiveIntensity={1.2}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>
          )}
        </Billboard>
      </group>
    </>
  );
}