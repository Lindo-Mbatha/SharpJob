import { WifiOff } from "lucide-react";

export function OfflineBanner({ darkMode, visible }: { darkMode: boolean; visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      role="status"
      className={`shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold animate-slide-down ${
        darkMode ? "bg-rose-950/60 text-rose-300 border-b border-rose-900/60" : "bg-rose-50 text-rose-700 border-b border-rose-100"
      }`}
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      You're offline — showing saved data
    </div>
  );
}
