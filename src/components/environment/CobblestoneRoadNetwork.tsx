"use client";

import { useMemo } from "react";
import * as THREE from "three";

// ── 4 Authoritative Road Routes connecting Spawn [0, 0, 0] to the 4 Zones ──
const ROUTES = [
  // 1. To The Forge [6, 0, 4]
  {
    id: "forge-road",
    points: [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.8, 0, 1.2),
      new THREE.Vector3(3.6, 0, 2.4),
      new THREE.Vector3(5.2, 0, 3.5),
    ],
    width: 0.95,
  },
  // 2. To The Archives [-5, 0, 8]
  {
    id: "archives-road",
    points: [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-1.3, 0, 2.0),
      new THREE.Vector3(-2.8, 0, 4.4),
      new THREE.Vector3(-4.4, 0, 6.8),
    ],
    width: 0.95,
  },
  // 3. To The Oracle [-8, 0, -6]
  {
    id: "oracle-road",
    points: [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-2.0, 0, -1.5),
      new THREE.Vector3(-4.4, 0, -3.3),
      new THREE.Vector3(-6.8, 0, -5.1),
    ],
    width: 0.9,
  },
  // 4. To The Gateway [9, 0, -8] (arrives directly at the wooden bridge)
  {
    id: "gateway-road",
    points: [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2.2, 0, -2.0),
      new THREE.Vector3(4.8, 0, -4.2),
      new THREE.Vector3(7.2, 0, -6.1),
    ],
    width: 0.95,
  },
];

export default function CobblestoneRoadNetwork() {
  // ── 1. Continuous Cambered Roadbed Geometry ──────────────────────────
  const roadbedGeometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    let vertOffset = 0;

    // Palette: Rich dark charcoal/slate earthen bedding mortar
    const cEdge = new THREE.Color("#1a241e"); // Mossy edge fading into grass
    const cCrown = new THREE.Color("#2a333c"); // Dark stone mortar bed

    ROUTES.forEach((route) => {
      const curve = new THREE.CatmullRomCurve3(route.points);
      const segments = 32;
      const halfW = route.width / 2;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const pt = curve.getPoint(t);
        const tangent = curve.getTangent(t).normalize();

        // Perpendicular vector along ground plane
        const norm = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

        // 3 cross-section vertices: Left, Crown (center), Right
        const left = pt.clone().addScaledVector(norm, -halfW);
        const center = pt.clone();
        const right = pt.clone().addScaledVector(norm, halfW);

        // Subtle roadbed camber: edges sit flush at 0.003m, center at 0.006m
        left.y = 0.003;
        center.y = 0.006;
        right.y = 0.003;

        positions.push(
          left.x, left.y, left.z,
          center.x, center.y, center.z,
          right.x, right.y, right.z
        );

        colors.push(
          cEdge.r, cEdge.g, cEdge.b,
          cCrown.r, cCrown.g, cCrown.b,
          cEdge.r, cEdge.g, cEdge.b
        );

        if (i < segments) {
          const row0 = vertOffset + i * 3;
          const row1 = row0 + 3;

          // Quad left to center
          indices.push(row0, row0 + 1, row1 + 1);
          indices.push(row0, row1 + 1, row1);

          // Quad center to right
          indices.push(row0 + 1, row0 + 2, row1 + 2);
          indices.push(row0 + 1, row1 + 2, row1 + 1);
        }
      }

      vertOffset += (segments + 1) * 3;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // ── 2. Raised Cobblestone Paver Stones (Tactile 3D Relief) ────────────
  const paversGeometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    let vertOffset = 0;

    // Rich stone tones: granite, slate, weathered riverstone
    const paverTones = [
      new THREE.Color("#7e8b98"),
      new THREE.Color("#929fae"),
      new THREE.Color("#6c7886"),
      new THREE.Color("#a4b0bf"),
      new THREE.Color("#5f6a76"),
      new THREE.Color("#8894a2"),
    ];

    const addPaverStone = (
      center: THREE.Vector3,
      sizeX: number,
      sizeZ: number,
      height: number,
      color: THREE.Color
    ) => {
      const hx = sizeX / 2;
      const hz = sizeZ / 2;
      const y0 = 0.004;
      const y1 = y0 + height;

      // 8 vertices of a beveled stone paver
      const v = [
        [center.x - hx * 0.88, y1, center.z - hz * 0.88], // 0: top-left
        [center.x + hx * 0.88, y1, center.z - hz * 0.88], // 1: top-right
        [center.x + hx * 0.88, y1, center.z + hz * 0.88], // 2: bottom-right
        [center.x - hx * 0.88, y1, center.z + hz * 0.88], // 3: bottom-left
        [center.x - hx, y0, center.z - hz],               // 4: base-left-north
        [center.x + hx, y0, center.z - hz],               // 5: base-right-north
        [center.x + hx, y0, center.z + hz],               // 6: base-right-south
        [center.x - hx, y0, center.z + hz],               // 7: base-left-south
      ];

      v.forEach(([px, py, pz]) => {
        positions.push(px, py, pz);
        colors.push(color.r, color.g, color.b);
      });

      const o = vertOffset;
      // Top face (counter-clockwise when viewed from +Y looking down)
      indices.push(o, o + 3, o + 2, o, o + 2, o + 1);

      // Chamfered Sides (outward facing)
      // North (-Z)
      indices.push(o, o + 1, o + 5, o, o + 5, o + 4);
      // East (+X)
      indices.push(o + 1, o + 2, o + 6, o + 1, o + 6, o + 5);
      // South (+Z)
      indices.push(o + 2, o + 3, o + 7, o + 2, o + 7, o + 6);
      // West (-X)
      indices.push(o + 3, o, o + 4, o + 3, o + 4, o + 7);

      vertOffset += 8;
    };

    // Central Spawn Plaza Pavers (Concentric Octagonal Rings around spawn)
    const ringRadii = [0.38, 0.72, 1.05];
    ringRadii.forEach((rad, rIdx) => {
      const stones = 8 + rIdx * 5;
      for (let s = 0; s < stones; s++) {
        const angle = (s / stones) * Math.PI * 2 + (rIdx * 0.22);
        const px = Math.cos(angle) * rad;
        const pz = Math.sin(angle) * rad;
        const tone = paverTones[(s + rIdx * 3) % paverTones.length];
        const h = 0.0055 + Math.sin(s * 1.7) * 0.001;
        addPaverStone(new THREE.Vector3(px, 0, pz), 0.22, 0.19, h, tone);
      }
    });

    // Paved stones along all 4 routes (staggered medieval pattern)
    ROUTES.forEach((route, rIdx) => {
      const curve = new THREE.CatmullRomCurve3(route.points);
      const totalSteps = 38;

      for (let i = 2; i < totalSteps; i++) {
        const t = i / totalSteps;
        const pt = curve.getPoint(t);
        const tangent = curve.getTangent(t).normalize();
        const norm = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

        // 3 staggered pavers per row with slight variation
        const offsets = i % 2 === 0 ? [-0.27, 0.0, 0.27] : [-0.24, 0.24];
        const pw = i % 2 === 0 ? 0.22 : 0.26;

        offsets.forEach((off, oIdx) => {
          const jitterX = Math.sin(i * 3.1 + oIdx) * 0.02;
          const jitterZ = Math.cos(i * 2.3 + oIdx) * 0.02;
          const pos = pt.clone().addScaledVector(norm, off + jitterX);
          pos.z += jitterZ;

          const tone = paverTones[(i * 2 + oIdx + rIdx * 3) % paverTones.length];
          const h = 0.0055 + Math.sin(i + oIdx) * 0.0012;
          addPaverStone(pos, pw, 0.20, h, tone);
        });
      }
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group name="cobblestone-road-network">
      {/* ── Continuous Cambered Road Ribbon ──────────────────────────── */}
      <mesh geometry={roadbedGeometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.92}
          metalness={0.03}
        />
      </mesh>

      {/* ── Raised 3D Cobblestone Pavers & Plaza Hub ────────────────── */}
      <mesh geometry={paversGeometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.80}
          metalness={0.04}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
