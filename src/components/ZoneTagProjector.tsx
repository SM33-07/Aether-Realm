"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ZONES } from "@/data/zones";

const tempVec = new THREE.Vector3();

export default function ZoneTagProjector() {
  useFrame(({ camera, size }) => {
    ZONES.forEach((zone) => {
      const el = document.getElementById(`zone-tag-${zone.id}`);
      if (!el) return;

      // 3D world position above the crystal (height Y = 2.2)
      tempVec.set(zone.position[0], 2.2, zone.position[2]);
      tempVec.project(camera);

      // Check if within visible camera frustum margin
      const isVisible =
        tempVec.z >= -1 &&
        tempVec.z <= 1 &&
        tempVec.x >= -1.25 &&
        tempVec.x <= 1.25 &&
        tempVec.y >= -1.25 &&
        tempVec.y <= 1.25;

      if (!isVisible) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        return;
      }

      el.style.opacity = "1";
      el.style.pointerEvents = "auto";

      // Convert Normalized Device Coordinates (NDC) to screen pixels
      const x = Math.round((tempVec.x * 0.5 + 0.5) * size.width);
      const y = Math.round((-tempVec.y * 0.5 + 0.5) * size.height);

      // Clamp screen pixels safely within viewport boundaries to prevent edge clipping
      const marginX = Math.min(100, size.width * 0.22);
      const marginY = 50;
      const clampedX = Math.round(
        Math.max(marginX, Math.min(size.width - marginX, x))
      );
      const clampedY = Math.round(
        Math.max(marginY, Math.min(size.height - 30, y))
      );

      // GPU-accelerated transform pinning the tag above the crystal without edge clipping
      el.style.transform = `translate(-50%, -100%) translate3d(${clampedX}px, ${clampedY}px, 0px)`;
    });
  });

  return null;
}
