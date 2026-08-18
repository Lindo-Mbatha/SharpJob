import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { AppTab } from "../types/domain";
import { triggerHapticFeedback } from "../monitoring/haptics";

type WalkthroughStep = {
  target: AppTab | null;
  title: string;
  body: string;
};

const STEPS: WalkthroughStep[] = [
  {
    target: null,
    title: "Welcome to SharpJob 👋",
    body: "Let's take a quick tour so you know exactly where everything is. It only takes a few seconds."
  },
  {
    target: "home",
    title: "Home",
    body: "Browse the latest active job listings, freshest opportunities first."
  },
  {
    target: "explore",
    title: "Explore",
    body: "Search and filter jobs by keyword, location, and more with advanced search."
  },
  {
    target: "saved",
    title: "Saved",
    body: "Bookmark jobs you like and find them again here anytime."
  },
  {
    target: "alerts",
    title: "Alerts",
    body: "Get notified about new matches, interview reminders, and closing dates."
  },
  {
    target: "profile",
    title: "Profile",
    body: "Manage your resume, notification preferences, and app settings."
  },
  {
    target: null,
    title: "You're all set!",
    body: "Start exploring jobs and apply with confidence. You can replay this tour anytime from Profile → App Settings."
  }
];

type SpotlightRect = { top: number; left: number; width: number; height: number };

export function OnboardingWalkthrough({
  active,
  darkMode,
  isMobileView,
  activeAccentPrimary,
  hapticsEnabled,
  activeTab,
  onSelectTab,
  getTabRef,
  onFinish
}: {
  active: boolean;
  darkMode: boolean;
  isMobileView: boolean;
  activeAccentPrimary: string;
  hapticsEnabled: boolean;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  getTabRef: (tab: AppTab) => HTMLElement | null;
  onFinish: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const step = STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  useEffect(() => {
    if (active) setStepIndex(0);
  }, [active]);

  useEffect(() => {
    if (!active || !step.target) return;
    onSelectTab(step.target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepIndex]);

  useLayoutEffect(() => {
    if (!active) return;

    const measure = () => {
      const container = containerRef.current;
      const targetEl = step.target ? getTabRef(step.target) : null;
      if (!container || !targetEl) {
        setSpotlightRect(null);
        return;
      }

      const containerBox = container.getBoundingClientRect();
      const targetBox = targetEl.getBoundingClientRect();
      const padding = 6;

      setSpotlightRect({
        top: targetBox.top - containerBox.top - padding,
        left: targetBox.left - containerBox.left - padding,
        width: targetBox.width + padding * 2,
        height: targetBox.height + padding * 2
      });
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [active, stepIndex, activeTab, getTabRef, step.target]);

  if (!active) return null;

  const goNext = () => {
    void triggerHapticFeedback(hapticsEnabled);
    if (isLastStep) {
      onFinish();
      return;
    }
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    void triggerHapticFeedback(hapticsEnabled);
    setStepIndex(i => Math.max(i - 1, 0));
  };

  const skip = () => {
    void triggerHapticFeedback(hapticsEnabled);
    onFinish();
  };

  const cardPositionClass = spotlightRect
    ? `absolute left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[320px] ${isMobileView ? "bottom-24" : "bottom-20"}`
    : "flex-1 flex items-center justify-center px-6";

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="App walkthrough"
      className="absolute inset-0 z-[100] overflow-hidden"
    >
      {spotlightRect ? (
        <div
          className="absolute rounded-2xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
            boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.75)"
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-950/75 animate-fade-in" />
      )}

      {!isLastStep && (
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={skip}
            aria-label="Skip walkthrough"
            className="touch-target flex items-center gap-1 text-[11px] font-bold text-white/80 hover:text-white bg-black/30 px-2.5 py-1.5 rounded-full"
          >
            Skip <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className={spotlightRect ? "absolute inset-0 flex flex-col pointer-events-none" : "absolute inset-0 flex flex-col"}>
        <div className={`${cardPositionClass} pointer-events-auto`}>
          <div
            className={`relative rounded-2xl border p-4 shadow-2xl animate-scale-up ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            {spotlightRect && (
              <div
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}
              />
            )}

            <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{step.title}</p>
            <p className={`text-[12px] leading-relaxed mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {step.body}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === stepIndex ? `w-4 ${activeAccentPrimary}` : `w-1.5 ${darkMode ? "bg-slate-700" : "bg-slate-200"}`
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Previous step"
                    className={`touch-target flex items-center justify-center w-7 h-7 rounded-full border ${
                      darkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  className={`text-[12px] font-bold text-white px-4 py-1.5 rounded-full ${activeAccentPrimary}`}
                >
                  {isLastStep ? "Get Started" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
