"use client";

import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window === "undefined") return;

      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error msMaxTouchPoints is legacy IE/Edge
        navigator.msMaxTouchPoints > 0;

      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const isNarrowScreen = window.innerWidth <= 1024;

      // Treat as mobile/touch input mode if device has coarse touch input or narrow touch viewport
      setIsMobile(hasTouch && (isCoarsePointer || isNarrowScreen));
    };

    check();

    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  return isMobile;
}