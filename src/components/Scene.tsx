"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import AetherCrystal from "@/components/AetherCrytal";
import Avatar from "@/components/Avatar";
import WaypointPath from "@/components/WaypointPath";
import WorldGround from "@/components/WorldGround";
import WorldParticles from "@/components/WorldParticles";
import ZoneTagProjector from "@/components/ZoneTagProjector";
import { useDayNight } from "@/hooks/useDayNight";
import { ZONES } from "@/data/zones";

const zoneTriggers = ZONES.map((zone) => ({
  id: zone.id,
  position: new THREE.Vector3(zone.position[0], zone.position[1], zone.position[2]),
}));

function SceneInner() {
  useDayNight();

  return (
    <>
      <color attach="background" args={["#080611"]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#c084fc" />

      {/* 3D World to 2D Screen Projection for Zone Tags */}
      <ZoneTagProjector />

      <Suspense fallback={null}>
        <WorldGround />
        <WorldParticles />
        <WaypointPath />
        {ZONES.map((zone) => (
          <AetherCrystal
            key={zone.id}
            id={zone.id}
            position={zone.position}
            color={zone.color}
            shape={zone.shape}
          />
        ))}
        <Avatar zones={zoneTriggers} />
      </Suspense>
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      className="absolute inset-0"
      orthographic
      camera={{ position: [10, 10, 10], zoom: 80 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <SceneInner />
    </Canvas>
  );
}
