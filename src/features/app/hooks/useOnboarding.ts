import { useEffect, useRef, useState } from "react";
import { readStoredValue, writeStoredValue } from "./useProfileSettings";

const ONBOARDING_KEY = "sharpjob.onboarding.v1";

export function useOnboarding() {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await readStoredValue(ONBOARDING_KEY);
      if (cancelled) return;
      hasHydratedRef.current = true;
      if (stored !== "done") setIsOnboardingActive(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const completeOnboarding = () => {
    setIsOnboardingActive(false);
    void writeStoredValue(ONBOARDING_KEY, "done");
  };

  const startOnboarding = () => {
    setIsOnboardingActive(true);
  };

  return { isOnboardingActive, completeOnboarding, startOnboarding };
}
