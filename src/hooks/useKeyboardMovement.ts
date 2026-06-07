import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useGameStore } from "@/store/useGameStore";

const MOVE_SPEED = 0.025;

type KeysPressed = {
  [key: string]: boolean;
};

export type Zone = {
  id: string;
  position: THREE.Vector3;
};

export function useKeyboardMovement(
  groupRef: React.RefObject<THREE.Group | null>,
  ringRef?: React.RefObject<THREE.Mesh | null>,
  zones?: Zone[],
  directionRef?: React.MutableRefObject<
    "up" | "down" | "left" | "right"
  >,
  isMovingRef?: React.MutableRefObject<boolean>
) {
  const keysPressed = useRef<KeysPressed>(
    {}
  );

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      keysPressed.current[event.code] =
        true;
    };

    const handleKeyUp = (
      event: KeyboardEvent
    ) => {
      keysPressed.current[event.code] =
        false;
    };

    const handleBlur = () => {
      keysPressed.current = {};
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    window.addEventListener(
      "blur",
      handleBlur
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );

      window.removeEventListener(
        "blur",
        handleBlur
      );
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const position =
      groupRef.current.position;

    const speed =
      MOVE_SPEED * delta * 60;

    const up =
      keysPressed.current["ArrowUp"] ||
      keysPressed.current["KeyW"];

    const down =
      keysPressed.current["ArrowDown"] ||
      keysPressed.current["KeyS"];

    const left =
      keysPressed.current["ArrowLeft"] ||
      keysPressed.current["KeyA"];

    const right =
      keysPressed.current["ArrowRight"] ||
      keysPressed.current["KeyD"];

    const moving =
      up ||
      down ||
      left ||
      right;

    if (isMovingRef) {
      isMovingRef.current =
        moving;
    }

    if (up && directionRef) {
      directionRef.current =
        "up";
    }

    if (down && directionRef) {
      directionRef.current =
        "down";
    }

    if (left && directionRef) {
      directionRef.current =
        "left";
    }

    if (right && directionRef) {
      directionRef.current =
        "right";
    }

    // Forward
    if (up) {
      position.x -= speed;
      position.z -= speed;
    }

    // Backward
    if (down) {
      position.x += speed;
      position.z += speed;
    }

    // Left
    if (left) {
      position.x -= speed;
      position.z += speed;
    }

    // Right
    if (right) {
      position.x += speed;
      position.z -= speed;
    }

    // Constrain to ground mesh boundaries (20x20 grid, centered at 0)
    const BOUND = 9.8;
    position.x = Math.max(-BOUND, Math.min(BOUND, position.x));
    position.z = Math.max(-BOUND, Math.min(BOUND, position.z));

    // Proximity Detection
    const {
      visitZone,
      setCurrentZone,
    } = useGameStore.getState();

    let insideZone = false;

    zones?.forEach((zone) => {
      const distance =
        position.distanceTo(
          zone.position
        );

      if (distance < 2.5) {
        insideZone = true;
        visitZone(zone.id);
      }
    });

    if (!insideZone) {
      setCurrentZone(null);
    }
  });
}