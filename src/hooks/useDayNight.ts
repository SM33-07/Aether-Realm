import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const TIME_PRESETS = {
  night: {
    ambient: "#050318",
    intensity: 0.05,
    dirColor: "#1a0f3d",
    dirIntensity: 0.2,
  },
  morning: {
    ambient: "#1a1040",
    intensity: 0.35,
    dirColor: "#c084fc",
    dirIntensity: 2.5,
  },
  day: {
    ambient: "#0d0824",
    intensity: 0.4,
    dirColor: "#e0d0ff",
    dirIntensity: 3.0,
  },
  evening: {
    ambient: "#1a0818",
    intensity: 0.2,
    dirColor: "#f59e0b",
    dirIntensity: 1.8,
  },
};

export function useDayNight() {
  const { scene } = useThree();

  useEffect(() => {
    const hour = new Date().getHours();
    const preset =
      hour < 6
        ? TIME_PRESETS.night
        : hour < 12
        ? TIME_PRESETS.morning
        : hour < 18
        ? TIME_PRESETS.day
        : TIME_PRESETS.evening;

    scene.traverse((obj) => {
      if (obj instanceof THREE.AmbientLight) {
        obj.color.set(preset.ambient);
        obj.intensity = preset.intensity;
      }
      if (obj instanceof THREE.DirectionalLight) {
        obj.color.set(preset.dirColor);
        obj.intensity = preset.dirIntensity;
      }
    });
  }, [scene]);
}
