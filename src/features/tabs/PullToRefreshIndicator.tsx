import { RefreshCw } from "lucide-react";
import { PULL_TO_REFRESH_THRESHOLD } from "../app/hooks/usePullToRefresh";

export function PullToRefreshIndicator({
  isMobileView,
  darkMode,
  activeAccentPrimary,
  pullDistance,
  isPulling,
  isRefreshing
}: {
  isMobileView: boolean;
  darkMode: boolean;
  activeAccentPrimary: string;
  pullDistance: number;
  isPulling: boolean;
  isRefreshing: boolean;
}) {
  if (pullDistance <= 0 && !isRefreshing) return null;

  const progress = Math.min(pullDistance / PULL_TO_REFRESH_THRESHOLD, 1);
  const triggered = progress >= 1;

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 z-40 pointer-events-none ${isMobileView ? "top-3" : "top-14"}`}
      style={{
        opacity: isRefreshing ? 1 : progress,
        transform: `translateX(-50%) scale(${0.6 + progress * 0.4})`,
        transition: isPulling ? "none" : "opacity 0.2s ease, transform 0.2s ease"
      }}
    >
      <div
        className={`w-8 h-8 rounded-full border shadow-lg flex items-center justify-center ${
          triggered || isRefreshing
            ? `${activeAccentPrimary} border-transparent`
            : darkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-slate-200"
        }`}
      >
        <RefreshCw
          className={`h-4 w-4 ${
            isRefreshing ? "animate-spin text-white" : triggered ? "text-white" : darkMode ? "text-slate-400" : "text-slate-500"
          }`}
          style={isRefreshing ? undefined : { transform: `rotate(${progress * 360}deg)` }}
        />
      </div>
    </div>
  );
}
