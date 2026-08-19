import { useEffect, useState } from "react";

function getIsVisible(): boolean {
  if (typeof document === "undefined") return true;
  return document.visibilityState === "visible";
}

// Tracks whether the app is in the foreground. Used to treat a backgrounded
// or closed app the same as "offline" for presence purposes.
export function useAppVisibility(): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(getIsVisible);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleChange = () => setIsVisible(getIsVisible());
    const handleHide = () => setIsVisible(false);

    document.addEventListener("visibilitychange", handleChange);
    window.addEventListener("pageshow", handleChange);
    window.addEventListener("pagehide", handleHide);

    return () => {
      document.removeEventListener("visibilitychange", handleChange);
      window.removeEventListener("pageshow", handleChange);
      window.removeEventListener("pagehide", handleHide);
    };
  }, []);

  return isVisible;
}
