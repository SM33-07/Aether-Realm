import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";
import { ZONES } from "@/data/zones";

const LERP_FACTOR = 0.08;

export function useCameraFollow(
  groupRef: React.RefObject<THREE.Group | null>
) {
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const { camera } = state;
    const orthCam = camera as THREE.OrthographicCamera;

    const gameState = useGameStore.getState();
    const isFocus = gameState.cutsceneActive || gameState.dialogueActive;
    const currentZoneData = ZONES.find((z) => z.id === gameState.currentZone);

    // Target positions: focus on zone crystal during cutscene/dialogue, or follow avatar
    let focusX = groupRef.current.position.x;
    let focusZ = groupRef.current.position.z;

    if (isFocus && currentZoneData) {
      focusX = currentZoneData.position[0];
      focusZ = currentZoneData.position[2];
    }

    if (isNaN(focusX) || isNaN(focusZ)) return;

    const targetX = focusX + 10;
    const targetZ = focusZ + 10;

    const safeDelta = Math.min(delta, 0.05);
    const alpha = Math.min(1, Math.max(0, LERP_FACTOR * safeDelta * 60));

    // Smoothly lerp camera position
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetX,
      alpha
    );

    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZ,
      alpha
    );

    camera.position.y = 10;

    // Smoothly lerp camera zoom for cutscene depth
    const targetZoom = isFocus ? 105 : 80;
    orthCam.zoom = THREE.MathUtils.lerp(orthCam.zoom, targetZoom, alpha * 0.8);
    orthCam.updateProjectionMatrix();

    // Look at target focus point
    camera.lookAt(focusX, 0, focusZ);
  });
}