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

  const relicRef =
    useRef<THREE.Group>(null);

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

  const tempEulerRef =
    useRef(new THREE.Euler());

  const tempQuatRef =
    useRef(new THREE.Quaternion());

  const FPS = 10;
  const FRAME_COUNT = 8;

  const visitedZones =
    useGameStore(
      (state) => state.visitedZones
    );

  const justLeveledUp =
    useGameStore(
      (state) =>
        state.justLeveledUp
    );

  const hasForge =
    visitedZones.includes(
      "the-forge"
    );

  const hasArchives =
    visitedZones.includes(
      "the-archives"
    );

  const hasOracle =
    visitedZones.includes(
      "the-oracle"
    );

  const hasGateway =
    visitedZones.includes(
      "the-gateway"
    );

  const hasThreeZones =
    visitedZones.length >= 3;

  const textures =
    useTexture(
      SPRITE_TEXTURES
    );

  useEffect(() => {
    Object.values(textures).forEach(
      (tex) => {
        tex.repeat.set(
          1 / FRAME_COUNT,
          -1
        );

        tex.offset.set(0, 1);

        tex.magFilter =
          THREE.NearestFilter;

        tex.minFilter =
          THREE.NearestFilter;

        tex.flipY = false;

        tex.needsUpdate = true;
      }
    );
  }, [textures]);

  useEffect(() => {
    if (!justLeveledUp) return;

    const timer =
      setTimeout(() => {
        useGameStore
          .getState()
          .resetLevelUpFlag();
      }, 1000);

    return () =>
      clearTimeout(timer);
  }, [justLeveledUp]);

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

    const texture =
      textures[
      textureKey as keyof typeof textures
      ];

    if (
      textureKey !==
      prevTextureKeyRef.current
    ) {
      frameRef.current = 0;
      frameTimeRef.current = 0;
      prevTextureKeyRef.current =
        textureKey;

      if (spriteMeshRef.current && texture) {
        const material =
          spriteMeshRef.current
            .material as THREE.MeshBasicMaterial;
        material.map = texture;
        material.needsUpdate = true;
      }
    }

    if (!texture) return;

    texture.offset.x =
      frameRef.current /
      FRAME_COUNT;

    // Idle breathing animation
    if (spriteMeshRef.current) {
      if (!isMovingRef.current) {
        spriteMeshRef.current.position.y =
          1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.035;
      } else {
        spriteMeshRef.current.position.y = 1.0;
      }
    }

    /* ---------- Crown ---------- */

    if (crownRef.current) {
      crownRef.current.rotation.y +=
        delta * 1;

      crownRef.current.rotation.z =
        Math.sin(
          state.clock.elapsedTime *
          1.4
        ) * 0.05;

      crownRef.current.position.y =
        1.98 +
        Math.sin(
          state.clock.elapsedTime *
          3
        ) *
        0.015;
    }

    /* ---------- Aura ---------- */

    if (auraRef.current) {
      const pulse =
        1 +
        Math.sin(
          state.clock.elapsedTime *
          2.5
        ) *
        0.06;

      auraRef.current.scale.set(
        pulse,
        pulse,
        pulse
      );

      auraRef.current.rotation.z +=
        delta * 0.4;
    }

    /* ---------- Cape ---------- */

    if (capeRef.current) {
      const dir =
        directionRef.current;

      let targetX = 0;
      let targetZ = -0.06;
      let targetRotX =
        Math.PI / 12;
      let targetRotY = 0;
      let targetRotZ = 0;

      if (dir === "up") {
        targetZ = 0.06;
        targetRotX =
          -Math.PI / 12;
        targetRotY = Math.PI;
      } else if (
        dir === "left"
      ) {
        targetX = -0.35;
        targetRotX = 0;
        targetRotY =
          Math.PI / 2;
        targetRotZ =
          -Math.PI / 10;
      } else if (
        dir === "right"
      ) {
        targetX = 0.35;
        targetRotX = 0;
        targetRotY =
          -Math.PI / 2;
        targetRotZ =
          Math.PI / 10;
      }

      const waveX =
        Math.sin(
          state.clock.elapsedTime *
          4.5
        ) * 0.03;

      const waveY =
        Math.sin(
          state.clock.elapsedTime *
          2
        ) * 0.02;

      const waveZ =
        Math.sin(
          state.clock.elapsedTime *
          3
        ) * 0.015;

      tempEulerRef.current.set(
        targetRotX + waveX,
        targetRotY + waveY,
        targetRotZ + waveZ,
        "YXZ"
      );

      tempQuatRef.current.setFromEuler(
        tempEulerRef.current
      );

      capeRef.current.position.x =
        THREE.MathUtils.lerp(
          capeRef.current.position.x,
          targetX,
          0.15
        );

      capeRef.current.position.z =
        THREE.MathUtils.lerp(
          capeRef.current.position.z,
          targetZ,
          0.15
        );

      capeRef.current.position.y =
        0.5;

      capeRef.current.scale.y =
        1 +
        Math.sin(
          state.clock.elapsedTime *
          4
        ) *
        0.03;

      capeRef.current.quaternion.slerp(
        tempQuatRef.current,
        0.15
      );
    }

    /* ---------- Orbiting Relic ---------- */

    if (relicRef.current) {
      const angle =
        state.clock.elapsedTime *
        1.5;

      const radius = 0.6;

      const targetX =
        Math.cos(angle) *
        radius;

      const targetZ =
        Math.sin(angle) *
        radius;

      const targetY =
        1 +
        Math.sin(
          angle * 2
        ) *
        0.1;

      relicRef.current.position.x =
        THREE.MathUtils.lerp(
          relicRef.current.position.x,
          targetX,
          0.15
        );

      relicRef.current.position.y =
        THREE.MathUtils.lerp(
          relicRef.current.position.y,
          targetY,
          0.15
        );

      relicRef.current.position.z =
        THREE.MathUtils.lerp(
          relicRef.current.position.z,
          targetZ,
          0.15
        );

      relicRef.current.rotation.x +=
        delta * 1.2;

      relicRef.current.rotation.y +=
        delta * 2.5;

      relicRef.current.rotation.z +=
        delta * 0.8;
    }
  });
  return (
    <>
      {/* Avatar Group */}
      <group ref={groupRef}>
        {/* Dark Ground Ring under Avatar */}
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
            color="#581c87"
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Billboard (sprite always faces camera) */}
        <Billboard>
          {/* Sprite */}
          <mesh
            ref={spriteMeshRef}
            position={[0, 1.0, 0]}
          >
            <planeGeometry
              args={[2.4, 2.16]}
            />

            <meshBasicMaterial
              map={textures.idle_down}
              transparent
              alphaTest={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* =========================
            FORGE EVOLUTION
            Floating Crown
        ========================== */}

          {hasForge && (
            <group
              ref={crownRef}
              position={[
                0,
                1.98,
                0.02,
              ]}
            >
              {/* Crown Ring */}
              <mesh
                rotation={[
                  Math.PI / 2,
                  0,
                  0,
                ]}
              >
                <torusGeometry
                  args={[
                    0.22,
                    0.03,
                    8,
                    24,
                  ]}
                />

                <meshStandardMaterial
                  color="#f59e0b"
                  emissive="#f59e0b"
                  emissiveIntensity={1.5}
                />
              </mesh>

              {/* Crown Spikes */}

              {Array.from({
                length: 5,
              }).map((_, index) => {
                const angle =
                  (index / 5) *
                  Math.PI *
                  2;

                const x =
                  Math.cos(angle) *
                  0.22;

                const z =
                  Math.sin(angle) *
                  0.22;

                return (
                  <mesh
                    key={index}
                    position={[
                      x,
                      0.08,
                      z,
                    ]}
                  >
                    <coneGeometry
                      args={[
                        0.04,
                        0.12,
                        4,
                      ]}
                    />

                    <meshStandardMaterial
                      color="#f59e0b"
                      emissive="#f59e0b"
                      emissiveIntensity={
                        1.5
                      }
                    />
                  </mesh>
                );
              })}

              {/* Shoulder Crystal */}

              <mesh
                position={[
                  0.28,
                  -0.12,
                  0,
                ]}
                rotation={[
                  0,
                  0,
                  Math.PI / 6,
                ]}
              >
                <octahedronGeometry
                  args={[0.09, 0]}
                />

                <meshStandardMaterial
                  color="#f59e0b"
                  emissive="#f59e0b"
                  emissiveIntensity={
                    2
                  }
                />
              </mesh>
            </group>
          )}

          {/* =========================
            ARCHIVES
            Knowledge Sparkles
        ========================== */}

          {hasArchives && (
            <Sparkles
              count={15}
              scale={[
                1.2,
                1.2,
                1.2,
              ]}
              size={1.2}
              speed={1.2}
              opacity={0.4}
              color="#06b6d4"
              position={[
                0,
                1,
                0,
              ]}
            />
          )}

          {/* =========================
            ORACLE
            Void Aura
        ========================== */}

          {hasOracle && (
            <group>
              {hasThreeZones && (
                <Sparkles
                  count={20}
                  scale={[
                    1.0,
                    1.0,
                    0.2,
                  ]}
                  size={1.8}
                  speed={1.2}
                  opacity={0.4}
                  color="#c084fc"
                  position={[
                    0,
                    1,
                    -0.02,
                  ]}
                />
              )}
            </group>
          )}

          {/* =========================
            GATEWAY
            Subtle Arcane Motes
        ========================== */}

          {hasGateway && (
            <Sparkles
              count={12}
              scale={[1.2, 1.2, 0.3]}
              size={1.5}
              speed={1.5}
              opacity={0.4}
              color="#ec4899"
              position={[0, 1.0, 0]}
            />
          )}
        </Billboard>
        {/* ======================================
          ARCHIVES EVOLUTION
          Orbiting Relic (World Space)
      ======================================= */}

        {hasArchives && (
          <group ref={relicRef}>
            <mesh>
              <octahedronGeometry
                args={[0.08, 0]}
              />

              <meshStandardMaterial
                color="#06b6d4"
                emissive="#06b6d4"
                emissiveIntensity={1.2}
                metalness={0.8}
                roughness={0.15}
              />
            </mesh>

            <pointLight
              color="#06b6d4"
              intensity={0.5}
              distance={1.5}
            />

            <Sparkles
              count={10}
              scale={0.35}
              size={1}
              speed={1}
              color="#06b6d4"
            />
          </group>
        )}

        {/* ======================================
          LEVEL UP VFX
      ======================================= */}

        {justLeveledUp && (
          <>
            <Sparkles
              count={150}
              scale={3}
              size={4}
              speed={5}
              opacity={1}
              color="#f59e0b"
            />

            <pointLight
              color="#f59e0b"
              intensity={4}
              distance={6}
            />
          </>
        )}
      </group>
    </>
  );
}