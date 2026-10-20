"use client";

import { useEffect, useRef, useState } from "react";
import { joystick, resetJoystick } from "@/lib/inputState";
import { useGameStore } from "@/store/useGameStore";

type JoystickProps = {
  onMove?: (x: number, y: number) => void;
};

const MAX_RADIUS = 50;

export default function VirtualJoystick({ onMove }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dialogueActive = useGameStore((s) => s.dialogueActive);
  const cutsceneActive = useGameStore((s) => s.cutsceneActive);
  const interactionPhase = useGameStore((s) => s.interactionPhase);

  const reset = () => {
    if (
      activePointerId.current !== null &&
      baseRef.current &&
      baseRef.current.hasPointerCapture(activePointerId.current)
    ) {
      try {
        baseRef.current.releasePointerCapture(activePointerId.current);
      } catch {
        // Pointer capture may have already been released
      }
    }
    activePointerId.current = null;
    setStickPos({ x: 0, y: 0 });
    setIsDragging(false);
    resetJoystick();
    onMove?.(0, 0);
  };

  // Reset if window loses focus or when component unmounts
  useEffect(() => {
    const handleBlur = () => reset();
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("blur", handleBlur);
      reset();
    };
  }, []);

  // Reset when dialogue or cutscene locks movement
  useEffect(() => {
    if (dialogueActive || cutsceneActive || interactionPhase !== "idle") {
      reset();
    }
  }, [dialogueActive, cutsceneActive, interactionPhase]);

  const updatePosition = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;

    const rect = base.getBoundingClientRect();
    let dx = clientX - (rect.left + rect.width / 2);
    let dy = clientY - (rect.top + rect.height / 2);

    const distance = Math.hypot(dx, dy);

    if (distance > MAX_RADIUS) {
      const scale = MAX_RADIUS / distance;
      dx *= scale;
      dy *= scale;
    }

    setStickPos({ x: dx, y: dy });

    const normX = dx / MAX_RADIUS;
    const normY = dy / MAX_RADIUS;

    joystick.x = normX;
    joystick.y = normY;
    onMove?.(normX, normY);
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={(event) => {
        // Ignore if already tracking a pointer
        if (activePointerId.current !== null) return;

        event.preventDefault();
        event.stopPropagation();
        activePointerId.current = event.pointerId;
        setIsDragging(true);

        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // ignore
        }

        updatePosition(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (event.pointerId !== activePointerId.current) return;
        event.preventDefault();
        event.stopPropagation();
        updatePosition(event.clientX, event.clientY);
      }}
      onPointerUp={(event) => {
        if (event.pointerId !== activePointerId.current) return;
        event.preventDefault();
        reset();
      }}
      onPointerCancel={(event) => {
        if (event.pointerId !== activePointerId.current) return;
        event.preventDefault();
        reset();
      }}
      onLostPointerCapture={(event) => {
        if (event.pointerId === activePointerId.current) {
          reset();
        }
      }}
      onContextMenu={(event) => event.preventDefault()}
      className="fixed z-[60] bottom-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] left-[calc(env(safe-area-inset-left,0px)+1.5rem)] h-28 w-28 rounded-full select-none"
      style={{
        background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(9,9,15,0.85) 70%)",
        border: "2px solid rgba(168,85,247,0.4)",
        boxShadow: "0 0 24px rgba(168,85,247,0.2), inset 0 0 16px rgba(168,85,247,0.1)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        touchAction: "none",
        WebkitUserSelect: "none",
      }}
      aria-label="Movement joystick"
      role="region"
    >
      {/* Direction Crosshair markers */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <div className="h-full w-px bg-purple-400" />
        <div className="absolute h-px w-full bg-purple-400" />
      </div>

      {/* Thumb Stick Knob */}
      <div
        className="pointer-events-none absolute h-12 w-12 rounded-full"
        style={{
          background: "radial-gradient(circle, #c084fc 0%, #9333ea 70%, #6b21a8 100%)",
          border: "2px solid rgba(255,255,255,0.8)",
          boxShadow: "0 0 16px rgba(168,85,247,0.8), inset 0 0 8px rgba(255,255,255,0.4)",
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${stickPos.x}px), calc(-50% + ${stickPos.y}px))`,
          transition: isDragging ? "none" : "transform 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}
