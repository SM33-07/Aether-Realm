"use client";

import { useMemo } from "react";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { ZONES } from "@/data/zones";

export default function WorldGround() {
  // Generate a rich, continuous procedural grassland canvas texture with organic footpaths and natural clearings
  const groundTexture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const worldToCanvas = (x: number, z: number) => ({
      x: ((x + 10) / 20) * size,
      y: ((z + 10) / 20) * size,
    });

    // 1. Base Grassland Background (Deep rich moss & forest green)
    const baseGrad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.1,
      size / 2,
      size / 2,
      size * 0.65
    );
    baseGrad.addColorStop(0, "#264829"); // Healthy clearing moss green
    baseGrad.addColorStop(0.4, "#1f3d23"); // Meadow grass
    baseGrad.addColorStop(0.8, "#18301c"); // Forest undergrowth
    baseGrad.addColorStop(1, "#0d1c10"); // Perimeter shadow
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, size, size);

    // 2. Mottled organic grass patches & subtle turf tonal variations
    const patchSeeds = [
      { x: 340, y: 380, r: 160, c: "#2c5230" },
      { x: 680, y: 320, r: 140, c: "#1b361f" },
      { x: 420, y: 690, r: 180, c: "#2a4f2e" },
      { x: 740, y: 640, r: 150, c: "#244428" },
      { x: 220, y: 220, r: 130, c: "#172d1b" },
      { x: 820, y: 820, r: 120, c: "#2d482c" },
    ];
    patchSeeds.forEach(({ x, y, r, c }) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Subtle organic grass speckle noise
    ctx.fillStyle = "rgba(45, 85, 48, 0.18)";
    for (let i = 0; i < 1800; i++) {
      const rx = Math.random() * size;
      const ry = Math.random() * size;
      const rw = 2 + Math.random() * 4;
      ctx.fillRect(rx, ry, rw, rw);
    }
    ctx.fillStyle = "rgba(18, 36, 20, 0.22)";
    for (let i = 0; i < 1400; i++) {
      const rx = Math.random() * size;
      const ry = Math.random() * size;
      const rw = 2 + Math.random() * 5;
      ctx.fillRect(rx, ry, rw, rw);
    }

    // 3. Natural Earth Trails connecting Spawn to Zones
    const origin = worldToCanvas(0, 0);

    const drawEarthPath = (
      target: { x: number; y: number },
      width: number,
      color: string
    ) => {
      ctx.save();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);

      // Subtle natural curve via quadratic midpoint offset
      const midX = (origin.x + target.x) / 2 + (Math.random() - 0.5) * 20;
      const midY = (origin.y + target.y) / 2 + (Math.random() - 0.5) * 20;
      ctx.quadraticCurveTo(midX, midY, target.x, target.y);
      ctx.stroke();
      ctx.restore();
    };

    // Forge Path (Cobblestone & worn loam)
    const forgePos = worldToCanvas(6, 4);
    drawEarthPath(forgePos, 56, "rgba(62, 50, 36, 0.55)"); // Base worn loam
    drawEarthPath(forgePos, 36, "rgba(78, 65, 48, 0.45)"); // Packed dirt
    drawEarthPath(forgePos, 18, "rgba(95, 90, 82, 0.35)"); // Paver stone track

    // Archives Path (Stone track)
    const archivesPos = worldToCanvas(-5, 8);
    drawEarthPath(archivesPos, 48, "rgba(52, 58, 54, 0.45)");
    drawEarthPath(archivesPos, 28, "rgba(70, 78, 74, 0.35)");

    // Oracle Path (Pine needle earth trail)
    const oraclePos = worldToCanvas(-8, -6);
    drawEarthPath(oraclePos, 42, "rgba(45, 36, 28, 0.5)");
    drawEarthPath(oraclePos, 22, "rgba(60, 48, 38, 0.4)");

    // Gateway Path (Trampled meadow approach)
    const gatewayPos = worldToCanvas(9, -8);
    drawEarthPath(gatewayPos, 46, "rgba(56, 52, 38, 0.45)");
    drawEarthPath(gatewayPos, 24, "rgba(76, 72, 52, 0.35)");

    // 4. Central Spawn Clearing (Softly feathered worn earth)
    const spawnGrad = ctx.createRadialGradient(
      origin.x,
      origin.y,
      0,
      origin.x,
      origin.y,
      115
    );
    spawnGrad.addColorStop(0, "rgba(65, 54, 40, 0.65)"); // Soft center dirt
    spawnGrad.addColorStop(0.5, "rgba(50, 44, 32, 0.45)");
    spawnGrad.addColorStop(0.8, "rgba(35, 50, 32, 0.25)");
    spawnGrad.addColorStop(1, "transparent"); // Seamless blend into grass
    ctx.fillStyle = spawnGrad;
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 115, 0, Math.PI * 2);
    ctx.fill();

    // Subtle inscribed arcane earth ring at spawn (understated, not neon)
    ctx.strokeStyle = "rgba(168, 85, 247, 0.18)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 75, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Zone Ambient Soil Patches
    ZONES.forEach((zone) => {
      const pos = worldToCanvas(zone.position[0], zone.position[2]);
      const zoneGrad = ctx.createRadialGradient(
        pos.x,
        pos.y,
        0,
        pos.x,
        pos.y,
        90
      );
      zoneGrad.addColorStop(0, "rgba(48, 42, 34, 0.6)");
      zoneGrad.addColorStop(0.6, "rgba(38, 48, 36, 0.3)");
      zoneGrad.addColorStop(1, "transparent");
      ctx.fillStyle = zoneGrad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 90, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <group name="world-ground">
      {/* ── Continuous Stylized Grassland Plane ─────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20.2, 20.2]} />
        <meshStandardMaterial
          map={groundTexture || undefined}
          color={groundTexture ? "#ffffff" : "#1e3822"}
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* ── Zone Runic Floor Rings (Understated & Grounded) ────────── */}
      {ZONES.map((zone) => (
        <group
          key={`ground-${zone.id}`}
          position={[zone.position[0], 0.004, zone.position[2]]}
        >
          {/* Inner soft colored zone aura pad */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0, 1.8, 32]} />
            <meshBasicMaterial
              color={zone.color}
              transparent
              opacity={0.08}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Clean, subtle runic ring boundary */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
            <ringGeometry args={[1.75, 1.82, 32]} />
            <meshBasicMaterial
              color={zone.color}
              transparent
              opacity={0.3}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* ── Understated Tactical Surveyor Grid (Reduced visual dominance) ─ */}
      <Grid
        args={[20, 20]}
        position={[0, 0.006, 0]}
        cellColor="#2c4230"
        sectionColor="#3f5e46"
        cellSize={1}
        sectionSize={5}
        fadeDistance={22}
        fadeStrength={1.5}
      />
    </group>
  );
}