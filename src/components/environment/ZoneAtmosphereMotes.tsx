"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ClusterConfig {
  center: [number, number, number];
  color: string;
  count: number;
  size: number;
  radius: number;
  heightRange: number;
  swaySpeed: number;
  speed: number;
}

const REGION_CLUSTERS: ClusterConfig[] = [
  // 1. The Forge — Amber ember motes
  {
    center: [6, 0.4, 4],
    color: "#f59e0b",
    count: 22,
    size: 0.065,
    radius: 1.8,
    heightRange: 2.2,
    swaySpeed: 1.8,
    speed: 0.35,
  },
  // 2. The Archives — Shimmering cyan ancient rune motes
  {
    center: [-5, 0.5, 8],
    color: "#06b6d4",
    count: 18,
    size: 0.055,
    radius: 1.6,
    heightRange: 1.8,
    swaySpeed: 1.2,
    speed: 0.18,
  },
  // 3. The Oracle — Violet drifting grove fireflies
  {
    center: [-8, 0.6, -6],
    color: "#c084fc",
    count: 20,
    size: 0.06,
    radius: 2.0,
    heightRange: 2.0,
    swaySpeed: 1.4,
    speed: 0.22,
  },
  // 4. The Gateway — Rose threshold drift motes
  {
    center: [7.8, 0.5, -6.8],
    color: "#f472b6",
    count: 18,
    size: 0.055,
    radius: 1.5,
    heightRange: 1.6,
    swaySpeed: 1.5,
    speed: 0.25,
  },
];

function MoteCluster({ config }: { config: ClusterConfig }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, initialData] = useMemo(() => {
    const pos = new Float32Array(config.count * 3);
    const data = [];

    for (let i = 0; i < config.count; i++) {
      const rad = 0.3 + Math.random() * config.radius;
      const angle = Math.random() * Math.PI * 2;
      const x = config.center[0] + Math.cos(angle) * rad;
      const y = config.center[1] + Math.random() * config.heightRange;
      const z = config.center[2] + Math.sin(angle) * rad;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      data.push({
        baseX: x,
        baseZ: z,
        speed: config.speed * (0.7 + Math.random() * 0.6),
        swaySpeed: config.swaySpeed * (0.8 + Math.random() * 0.5),
        phase: Math.random() * Math.PI * 2,
        maxHeight: config.heightRange + 0.3,
      });
    }

    return [pos, data];
  }, [config]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;
    const safeDelta = Math.min(delta, 0.05);

    for (let i = 0; i < config.count; i++) {
      const d = initialData[i];
      let y = array[i * 3 + 1] + d.speed * safeDelta;

      if (y > config.center[1] + d.maxHeight) {
        y = config.center[1] + 0.08;
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
        color={config.color}
        size={config.size}
        transparent
        opacity={0.82}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ZoneAtmosphereMotes() {
  return (
    <group name="regional-atmosphere-motes">
      {REGION_CLUSTERS.map((config, idx) => (
        <MoteCluster key={`cluster-${idx}`} config={config} />
      ))}
    </group>
  );
}
