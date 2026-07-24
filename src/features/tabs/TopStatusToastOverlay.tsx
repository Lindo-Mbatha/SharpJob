import { Wifi, X } from "lucide-react";

export function TopStatusToastOverlay({
  isMobileView,
  darkMode,
  phoneTime,
  networkOnline,
  networkLabel,
  batteryCharging,
  batteryLevel,
  toastMessage,
  logoSrc,
  onDismissToast
}: {
  isMobileView: boolean;
  darkMode: boolean;
  phoneTime: string;
  networkOnline: boolean;
  networkLabel: string;
  batteryCharging: boolean;
  batteryLevel: number;
  toastMessage: string | null;
  logoSrc: string;
  onDismissToast: () => void;
}) {
  return (
    <>
      {!isMobileView && (
        <div className={`h-11 px-6 pt-3 flex items-center justify-between z-40 relative select-none shrink-0 ${
          darkMode ? "bg-slate-950 text-slate-200" : "bg-white text-slate-700"
        }`}>
          <span className="text-xs font-semibold tracking-tight">{phoneTime}</span>

          <div className="absolute left-1/2 -translate-x-1/2 top-2 h-5 w-24 bg-black rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full absolute right-4" />
            <div className="w-12 h-1 bg-slate-850 rounded-full absolute top-1" />
          </div>

          <div className="flex items-center gap-1.5">
            <Wifi className={`w-3.5 h-3.5 ${networkOnline ? (darkMode ? "text-slate-300" : "text-slate-600") : "text-rose-500"}`} />
            <span className="text-[10px] font-bold tracking-tighter">{networkLabel}</span>
            <div className="w-[18px] h-2.5 rounded border border-current p-[1px] flex items-center">
              <div
                className={`h-full rounded-xs transition-all duration-300 ${batteryCharging ? "bg-emerald-500" : "bg-current"}`}
                style={{ width: `${Math.round(Math.max(0, Math.min(1, batteryLevel)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className={`absolute left-3 right-3 z-50 animate-slide-down ${isMobileView ? "top-3" : "top-12"}`}>
          <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 shadow-lg flex gap-3 items-start select-none">
            <img
              src={logoSrc}
              alt="SharpJob logo"
              className="h-8 w-8 rounded-lg shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-100 flex items-center justify-between">
                SharpJob
                <span className="text-[9px] font-normal text-slate-400">now</span>
              </p>
              <p className="text-xs text-slate-300 font-medium leading-tight mt-0.5 line-clamp-2">
                {toastMessage}
              </p>
            </div>
            <button
              onClick={onDismissToast}
              className="text-slate-400 hover:text-white p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
