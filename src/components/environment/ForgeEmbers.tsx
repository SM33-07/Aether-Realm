"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ForgeEmbers({
  count = 20,
  center = [6, 0.5, 4] as [number, number, number],
}: {
  count?: number;
  center?: [number, number, number];
}) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, initialData] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const data = [];

    for (let i = 0; i < count; i++) {
      const radius = 0.4 + Math.random() * 1.6;
      const angle = Math.random() * Math.PI * 2;
      const x = center[0] + Math.cos(angle) * radius;
      const y = center[1] + Math.random() * 2.2;
      const z = center[2] + Math.sin(angle) * radius;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      data.push({
        baseX: x,
        baseZ: z,
        speed: 0.3 + Math.random() * 0.4,
        swaySpeed: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        maxHeight: 2.5 + Math.random() * 0.8,
      });
    }

    return [pos, data];
  }, [count, center]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    const safeDelta = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      const d = initialData[i];
      let y = array[i * 3 + 1] + d.speed * safeDelta;

      if (y > center[1] + d.maxHeight) {
        y = center[1] + 0.1;
      }

      array[i * 3 + 1] = y;
      array[i * 3] =
        d.baseX + Math.sin(y * d.swaySpeed + d.phase) * 0.08;
      array[i * 3 + 2] =
        d.baseZ + Math.cos(y * d.swaySpeed + d.phase) * 0.08;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fbbf24"
        size={0.065}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
