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

      // Convert Normalized Device Coordinates (NDC) to screen pixels
      const x = Math.round((tempVec.x * 0.5 + 0.5) * size.width);
      const y = Math.round((-tempVec.y * 0.5 + 0.5) * size.height);

      // GPU-accelerated transform pinning the tag directly above the 3D crystal
      el.style.transform = `translate(-50%, -100%) translate3d(${x}px, ${y}px, 0px)`;
    });
  });

  return null;
}
