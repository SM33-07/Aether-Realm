"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import AetherCrystal from "@/components/AetherCrytal";
import WorldGround from "@/components/WorldGround";
import Avatar from "@/components/Avatar";
import { useDayNight } from "@/hooks/useDayNight";

import { ZONES } from "@/data/zones";

const zoneTriggers = ZONES.map(
  (zone) => ({
    id: zone.id,

    position: new THREE.Vector3(
      zone.position[0],
      zone.position[1],
      zone.position[2]
    ),
  })
);

function SceneInner() {
  useDayNight();

  return (
    <>
      <ambientLight intensity={0.2} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        color="#c084fc"
      />

      <Suspense fallback={null}>
        <WorldGround />

        {/* Zone Crystals */}
        {ZONES.map((zone) => (
          <AetherCrystal
            key={zone.id}
            id={zone.id}
            position={[
              zone.position[0],
              zone.position[1],
              zone.position[2],
            ]}
            color={zone.color}
            shape={zone.shape}
          />
        ))}

        {/* Player */}
        <Avatar
          zones={zoneTriggers}
        />
      </Suspense>
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      orthographic
      camera={{
        position: [10, 10, 10],
        zoom: 80,
      }}
    >
      <SceneInner />
    </Canvas>
  );
}