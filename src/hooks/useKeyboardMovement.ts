import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";

const MOVE_SPEED = 0.025;

type KeysPressed = Record<string, boolean>;

export type Zone = {
  id: string;
  position: THREE.Vector3;
};

export function useKeyboardMovement(
  groupRef: React.RefObject<THREE.Group | null>,
  ringRef?: React.RefObject<THREE.Mesh | null>,
  zones?: Zone[],
  directionRef?: React.MutableRefObject<"up" | "down" | "left" | "right">,
  isMovingRef?: React.MutableRefObject<boolean>
) {
  const keysPressed = useRef<KeysPressed>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.code] = true;

      if (event.code === "KeyE") {
        const state = useGameStore.getState();
        if (state.nearZone && state.interactionPhase === "idle") {
          event.preventDefault();
          state.startZoneInteraction();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.code] = false;
    };

    const handleBlur = () => {
      keysPressed.current = {};
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const state = useGameStore.getState();
    const movementLocked =
      !state.gameStarted ||
      state.interactionPhase === "cutscene" ||
      state.interactionPhase === "dialogue";

    if (movementLocked) {
      keysPressed.current = {};
      if (isMovingRef) isMovingRef.current = false;
      return;
    }

    const position = groupRef.current.position;
    const speed = MOVE_SPEED * Math.min(delta, 0.05) * 60;
    const up = keysPressed.current.ArrowUp || keysPressed.current.KeyW;
    const down = keysPressed.current.ArrowDown || keysPressed.current.KeyS;
    const left = keysPressed.current.ArrowLeft || keysPressed.current.KeyA;
    const right = keysPressed.current.ArrowRight || keysPressed.current.KeyD;
    const moving = up || down || left || right;

    if (isMovingRef) isMovingRef.current = moving;
    if (up && directionRef) directionRef.current = "up";
    if (down && directionRef) directionRef.current = "down";
    if (left && directionRef) directionRef.current = "left";
    if (right && directionRef) directionRef.current = "right";

    if (up) {
      position.x -= speed;
      position.z -= speed;
    }
    if (down) {
      position.x += speed;
      position.z += speed;
    }
    if (left) {
      position.x -= speed;
      position.z += speed;
    }
    if (right) {
      position.x += speed;
      position.z -= speed;
    }

    const BOUND = 9.8;
    position.x = Math.max(-BOUND, Math.min(BOUND, position.x));
    position.z = Math.max(-BOUND, Math.min(BOUND, position.z));

    let closestZone: string | null = null;
    zones?.forEach((zone) => {
      if (position.distanceTo(zone.position) < 2.5) closestZone = zone.id;
    });

    if (closestZone !== state.nearZone) state.setNearZone(closestZone);

    if (
      !closestZone &&
      state.interactionPhase === "content" &&
      state.currentZone !== null
    ) {
      state.closeZoneContent();
    }
  });
}
