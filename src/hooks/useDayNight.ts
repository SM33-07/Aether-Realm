import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const TIME_PRESETS = {
  night: {
    ambient: "#4c1d95",
    intensity: 0.5,
    dirColor: "#a855f7",
    dirIntensity: 1.8,
  },
  morning: {
    ambient: "#2e1065",
    intensity: 0.55,
    dirColor: "#c084fc",
    dirIntensity: 2.5,
  },
  day: {
    ambient: "#1e1b4b",
    intensity: 0.6,
    dirColor: "#e0d0ff",
    dirIntensity: 3.0,
  },
  evening: {
    ambient: "#312e81",
    intensity: 0.5,
    dirColor: "#f59e0b",
    dirIntensity: 2.0,
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
