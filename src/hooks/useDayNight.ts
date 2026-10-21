import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const TIME_PRESETS = {
  night: {
    ambient: "#94a3b8",
    intensity: 1.0,
    dirColor: "#e2e8f0",
    dirIntensity: 1.8,
  },
  morning: {
    ambient: "#cbd5e1",
    intensity: 1.1,
    dirColor: "#fef08a",
    dirIntensity: 2.2,
  },
  day: {
    ambient: "#e2e8f0",
    intensity: 1.15,
    dirColor: "#fffbeb",
    dirIntensity: 2.3,
  },
  evening: {
    ambient: "#fed7aa",
    intensity: 1.05,
    dirColor: "#fdba74",
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
