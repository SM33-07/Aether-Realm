
"use client";

import { useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

import AetherCrystal from "@/components/AetherCrytal";
import Avatar from "@/components/Avatar";
import WaypointPath from "@/components/WaypointPath";
import WorldGround from "@/components/WorldGround";
import WorldParticles from "@/components/WorldParticles";
import ZoneTagProjector from "@/components/ZoneTagProjector";
import { useDayNight } from "@/hooks/useDayNight";
import { ZONES } from "@/data/zones";
import WorldEnvironment from "@/components/environment/WorldEnvironment";

const zoneTriggers = ZONES.map((zone) => ({
  id: zone.id,
  position: new THREE.Vector3(
    zone.position[0],
    zone.position[1],
    zone.position[2]
  ),
}));

// Adjust orthographic zoom for smaller screens.
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    // Narrow the camera type before accessing orthographic properties.
    if (!(camera instanceof THREE.OrthographicCamera)) {
      return;
    }

    const isMobile = size.width < 768;

    camera.zoom = isMobile ? 68 : 80;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function SceneInner() {
  useDayNight();

  return (
    <>
      <ResponsiveCamera />

      <color attach="background" args={["#0c1424"]} />
      <fog attach="fog" args={["#0c1424", 26, 42]} />

      <ambientLight intensity={1.1} color="#cbd5e1" />

      <directionalLight
        position={[10, 14, 8]}
        intensity={2.2}
        color="#fef08a"
      />

      <directionalLight
        position={[-8, 8, -8]}
        intensity={0.55}
        color="#94a3b8"
      />

      <ZoneTagProjector />

      <Suspense fallback={null}>
        <WorldGround />
        <WorldParticles />
        <WaypointPath />
        <WorldEnvironment />

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
      camera={{
        position: [10, 10, 10],
        zoom: 80,
      }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <SceneInner />
    </Canvas>
  );
}
