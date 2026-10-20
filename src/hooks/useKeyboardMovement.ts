import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";
import { joystick, resetJoystick } from "@/lib/inputState";

const MOVE_SPEED = 0.05;
const DEAD_ZONE = 0.15;
const BOUND = 9.8;

export type Zone = {
  id: string;
  position: THREE.Vector3;
};

export function useKeyboardMovement(
  groupRef: React.RefObject<THREE.Group | null>,
  ringRef?: React.RefObject<THREE.Mesh | null>,
  zones?: Zone[],
  directionRef?: React.MutableRefObject<"down" | "up" | "left" | "right">,
  isMovingRef?: React.MutableRefObject<boolean>
) {
  const keysPressed = useRef<Record<string, boolean>>({});
  const stepDistRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;

      // Press 'E' to interact with near zone on desktop
      if (e.code === "KeyE") {
        const state = useGameStore.getState();
        if (state.nearZone && state.interactionPhase === "idle") {
          state.interactWithZone();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    const handleBlur = () => {
      keysPressed.current = {};
      resetJoystick();
      if (isMovingRef) isMovingRef.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isMovingRef]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const state = useGameStore.getState();
    const movementLocked =
      !state.gameStarted ||
      state.dialogueActive ||
      state.cutsceneActive ||
      state.interactionPhase === "cutscene" ||
      state.interactionPhase === "dialogue" ||
      state.interactionPhase === "content";

    if (movementLocked) {
      keysPressed.current = {};
      resetJoystick();
      if (isMovingRef) isMovingRef.current = false;
      return;
    }

    const position = groupRef.current.position;
    const speed = MOVE_SPEED * Math.min(delta, 0.05) * 60;

    // Check keyboard input
    const up = keysPressed.current.ArrowUp || keysPressed.current.KeyW;
    const down = keysPressed.current.ArrowDown || keysPressed.current.KeyS;
    const left = keysPressed.current.ArrowLeft || keysPressed.current.KeyA;
    const right = keysPressed.current.ArrowRight || keysPressed.current.KeyD;

    const kx = Number(!!right) - Number(!!left);
    const ky = Number(!!down) - Number(!!up);
    const keyboardActive = kx !== 0 || ky !== 0;

    // Check joystick input with dead zone processing
    const joyMagnitude = Math.hypot(joystick.x, joystick.y);
    const joystickActive = joyMagnitude > DEAD_ZONE;

    let moveX = 0;
    let moveZ = 0;
    let inputVectorX = 0;
    let inputVectorY = 0;

    if (joystickActive) {
      // Smoothly remap magnitude past dead zone to [0, 1] without an abrupt speed jump
      const adjustedMagnitude = Math.min(
        1,
        (joyMagnitude - DEAD_ZONE) / (1 - DEAD_ZONE)
      );
      const scale = adjustedMagnitude / joyMagnitude;

      inputVectorX = joystick.x * scale;
      inputVectorY = joystick.y * scale;

      // Isometric world projection:
      // Positive Y (drag down) -> move forward (+x, +z)
      // Negative Y (drag up)   -> move backward (-x, -z)
      // Negative X (drag left) -> move left (-x, +z)
      // Positive X (drag right)-> move right (+x, -z)
      moveX = (inputVectorX + inputVectorY) / Math.SQRT2;
      moveZ = (inputVectorY - inputVectorX) / Math.SQRT2;
    } else if (keyboardActive) {
      const kMag = Math.hypot(kx, ky);
      inputVectorX = kx / kMag;
      inputVectorY = ky / kMag;

      moveX = (inputVectorX + inputVectorY) / Math.SQRT2;
      moveZ = (inputVectorY - inputVectorX) / Math.SQRT2;
    }

    const moving = Math.abs(moveX) > 0.001 || Math.abs(moveZ) > 0.001;

    if (isMovingRef) {
      isMovingRef.current = moving;
    }

    // Determine character facing direction from the dominant screen-space axis
    if (moving && directionRef) {
      if (Math.abs(inputVectorX) > Math.abs(inputVectorY)) {
        directionRef.current = inputVectorX > 0 ? "right" : "left";
      } else {
        directionRef.current = inputVectorY > 0 ? "down" : "up";
      }
    }

    position.x += moveX * speed;
    position.z += moveZ * speed;

    // Award XP only during actual movement
    if (moving) {
      stepDistRef.current += speed;
      if (stepDistRef.current >= 0.7) {
        stepDistRef.current = 0;
        state.gainXP(5);
      }
    }

    // World boundary clamping
    position.x = Math.max(-BOUND, Math.min(BOUND, position.x));
    position.z = Math.max(-BOUND, Math.min(BOUND, position.z));

    // Proximity detection for interactable zones
    let closestZone: string | null = null;
    zones?.forEach((zone) => {
      if (position.distanceTo(zone.position) < 2.5) {
        closestZone = zone.id;
      }
    });

    if (closestZone !== state.nearZone) {
      state.setNearZone(closestZone);
    }

    if (
      !closestZone &&
      state.interactionPhase === "content" &&
      state.currentZone !== null
    ) {
      state.closeZoneContent();
    }
  });
}
