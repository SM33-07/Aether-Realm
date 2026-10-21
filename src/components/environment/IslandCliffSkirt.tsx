"use client";

import { useMemo } from "react";
import * as THREE from "three";
import EnvironmentModel from "./EnvironmentModel";

const BASE = "/models/environment/";
const POLYTOPE = "/models/environment/polytope/";
const SLAVIC = "/models/environment/slavic/";

export default function IslandCliffSkirt() {
  // ── 1. Procedural Faceted Cliff Undercarriage Geometry ───────────────
  const cliffGeometry = useMemo(() => {
    const segmentsPerSide = 8;
    const totalRimPoints = segmentsPerSide * 4;
    const half = 10.1; // Matches the 20.2m x 20.2m ground plane

    // Generate base perimeter points around the square island
    const perimeter: [number, number][] = [];

    // North side (z = -half, x from -half to half)
    for (let i = 0; i < segmentsPerSide; i++) {
      const t = i / segmentsPerSide;
      perimeter.push([-half + t * 2 * half, -half]);
    }
    // East side (x = half, z from -half to half)
    for (let i = 0; i < segmentsPerSide; i++) {
      const t = i / segmentsPerSide;
      perimeter.push([half, -half + t * 2 * half]);
    }
    // South side (z = half, x from half to -half)
    for (let i = 0; i < segmentsPerSide; i++) {
      const t = i / segmentsPerSide;
      perimeter.push([half - t * 2 * half, half]);
    }
    // West side (x = -half, z from half to -half)
    for (let i = 0; i < segmentsPerSide; i++) {
      const t = i / segmentsPerSide;
      perimeter.push([-half, half - t * 2 * half]);
    }

    // Deterministic pseudo-noise for organic craggy rock contours
    const getJitter = (index: number, mult: number) => {
      const angle = index * 2.399;
      return Math.sin(angle) * mult;
    };

    // 4 vertical tiers of the floating island cliff
    // Tier 0: Rim (y = 0.0)
    // Tier 1: Upper Ledge (y = -0.55)
    // Tier 2: Mid Face (y = -1.35)
    // Tier 3: Bottom Shelf (y = -2.3)
    const tiers = [
      { y: 0.0, scale: 1.0, jitter: 0.08 },
      { y: -0.55, scale: 1.025, jitter: 0.22 },
      { y: -1.35, scale: 0.94, jitter: 0.28 },
      { y: -2.3, scale: 0.72, jitter: 0.32 },
    ];

    const vertices: number[] = [];

    // Push tier vertices
    tiers.forEach((tier) => {
      perimeter.forEach(([px, pz], idx) => {
        const jx = getJitter(idx, tier.jitter);
        const jz = getJitter(idx + 13, tier.jitter);
        vertices.push(px * tier.scale + jx, tier.y, pz * tier.scale + jz);
      });
    });

    // Keel Tip vertex at the base of the floating island
    const keelIndex = tiers.length * totalRimPoints;
    vertices.push(0, -3.5, 0);

    const indices: number[] = [];

    // Helper: vertex index for (tier, perimeterIdx)
    const getIdx = (t: number, i: number) => t * totalRimPoints + (i % totalRimPoints);

    // Build quads (2 triangles) between adjacent tiers
    for (let t = 0; t < tiers.length - 1; t++) {
      for (let i = 0; i < totalRimPoints; i++) {
        const next = (i + 1) % totalRimPoints;
        const v0 = getIdx(t, i);
        const v1 = getIdx(t, next);
        const v2 = getIdx(t + 1, next);
        const v3 = getIdx(t + 1, i);

        // Tri 1 & Tri 2 facing outwards
        indices.push(v0, v3, v1);
        indices.push(v1, v3, v2);
      }
    }

    // Build bottom triangles connecting Tier 3 to the Keel tip
    const lastTier = tiers.length - 1;
    for (let i = 0; i < totalRimPoints; i++) {
      const next = (i + 1) % totalRimPoints;
      const v0 = getIdx(lastTier, i);
      const v1 = getIdx(lastTier, next);
      indices.push(v0, keelIndex, v1);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group name="island-depth-and-cliffs">
      {/* ── Faceted Low-Poly Floating Island Cliff Skirt ─────────────── */}
      <mesh geometry={cliffGeometry}>
        <meshStandardMaterial
          color="#182230"
          roughness={0.94}
          metalness={0.06}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Hanging Rock Crags Anchored to the Cliff Face ─────────────── */}
      <EnvironmentModel
        id="cliff-rock-south"
        path={`${BASE}PT_Generic_Rock_01.glb`}
        position={[4.2, -0.9, 10.3]}
        rotationX={2.7}
        rotationY={0.4}
        scale={2.2}
      />
      <EnvironmentModel
        id="cliff-rock-east"
        path={`${BASE}PT_Menhir_Rock_02.glb`}
        position={[10.3, -1.1, 1.8]}
        rotationZ={-1.2}
        rotationY={0.6}
        scale={0.7}
      />
      <EnvironmentModel
        id="cliff-rock-west"
        path={`${BASE}PT_Generic_Rock_01.glb`}
        position={[-10.3, -1.0, -1.8]}
        rotationZ={1.1}
        rotationY={-0.5}
        scale={2.0}
      />

      {/* ── Distant Peripheral Silhouettes (Environmental Framing) ───── */}
      {/* North-East Distant Crag */}
      <group position={[15.2, -1.2, -15.2]}>
        <EnvironmentModel
          id="dist-crag-ne-rock"
          path={`${BASE}PT_Generic_Rock_01.glb`}
          position={[0, 0, 0]}
          rotationY={0.6}
          scale={3.2}
        />
        <EnvironmentModel
          id="dist-crag-ne-pine"
          path={`${BASE}PT_Pine_Tree_03_green.glb`}
          position={[0.3, 0.4, -0.2]}
          rotationY={1.2}
          scale={0.34}
          isVegetation
        />
      </group>

      {/* South-East Distant Crag */}
      <group position={[16.0, -1.4, 14.2]}>
        <EnvironmentModel
          id="dist-crag-se-rock"
          path={`${BASE}PT_Menhir_Rock_02.glb`}
          position={[0, 0, 0]}
          rotationY={-0.8}
          scale={0.95}
        />
        <EnvironmentModel
          id="dist-crag-se-tree"
          path={`${SLAVIC}EA03_Nature_Tree_02b.glb`}
          position={[-0.4, 0.2, 0.4]}
          rotationY={0.4}
          scale={0.42}
          isVegetation
        />
      </group>

      {/* South-West Distant Crag */}
      <group position={[-15.2, -1.5, 14.0]}>
        <EnvironmentModel
          id="dist-crag-sw-rock"
          path={`${BASE}PT_Generic_Rock_01.glb`}
          position={[0, 0, 0]}
          rotationY={1.1}
          scale={3.0}
        />
        <EnvironmentModel
          id="dist-crag-sw-pine"
          path={`${POLYTOPE}PT_Pine_Tree_03_dead.glb`}
          position={[0.2, 0.3, -0.1]}
          rotationY={-0.6}
          scale={0.3}
          isVegetation
        />
      </group>

      {/* North-West Distant Crag */}
      <group position={[-15.0, -1.3, -15.2]}>
        <EnvironmentModel
          id="dist-crag-nw-rock"
          path={`${BASE}PT_River_Rock_Pile_02.glb`}
          position={[0, 0, 0]}
          rotationY={0.3}
          scale={1.6}
        />
        <EnvironmentModel
          id="dist-crag-nw-pine"
          path={`${BASE}PT_Pine_Tree_03_green.glb`}
          position={[-0.2, 0.3, 0.2]}
          rotationY={0.8}
          scale={0.32}
          isVegetation
        />
      </group>
    </group>
  );
}
