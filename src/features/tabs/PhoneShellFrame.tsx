import React from "react";

function getBacklightColor(accentColor: string): string {
  if (accentColor === "indigo") return "#4f46e5";
  if (accentColor === "blue") return "#2563eb";
  if (accentColor === "emerald") return "#10b981";
  if (accentColor === "rose") return "#f43f5e";
  return "#f59e0b";
}

export function PhoneShellFrame({
  isMobileView,
  darkMode,
  accentColor,
  highContrast,
  reduceMotion,
  dyslexiaFont,
  readableSpacing,
  reduceTransparency,
  focusIndicators,
  children
}: {
  isMobileView: boolean;
  darkMode: boolean;
  accentColor: string;
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
  readableSpacing: boolean;
  reduceTransparency: boolean;
  focusIndicators: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${isMobileView ? "h-screen w-screen" : "min-h-screen"} bg-slate-900 font-sans text-slate-100 flex items-center justify-center antialiased select-none`}>
      <div className={`flex items-center justify-center ${isMobileView ? "h-full w-full p-0" : "p-4 md:p-8 xl:p-12"} relative overflow-hidden bg-slate-900`}>
        {!isMobileView && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-10 pointer-events-none transition-all duration-700 bg-blue-500"
            style={{ backgroundColor: getBacklightColor(accentColor) }}
          />
        )}

        <div
          className={`relative w-full ${isMobileView ? "h-full rounded-none border-0 p-0 shadow-none" : "max-w-[400px] aspect-[9/19.5] rounded-[52px] border-[12px] p-3 shadow-2xl"} flex flex-col transition-all duration-300 select-none ${
            darkMode
              ? "bg-slate-950 border-slate-800 text-slate-100"
              : "bg-slate-50 border-slate-300 text-slate-800"
          }`}
          style={isMobileView ? undefined : { height: "820px" }}
        >
          {!isMobileView && (
            <>
              <div className={`absolute left-[-15px] top-[140px] w-1 h-12 rounded-l-md ${darkMode ? "bg-slate-800" : "bg-slate-400"}`} />
              <div className={`absolute left-[-15px] top-[200px] w-1 h-12 rounded-l-md ${darkMode ? "bg-slate-800" : "bg-slate-400"}`} />
              <div className={`absolute right-[-15px] top-[170px] w-1.5 h-16 rounded-r-md ${darkMode ? "bg-slate-800" : "bg-slate-400"}`} />
            </>
          )}

          <div className={`w-full h-full ${isMobileView ? "rounded-none" : "rounded-[40px]"} overflow-hidden flex flex-col relative ${
            darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"
          } ${highContrast ? `high-contrast ${darkMode ? "high-contrast-dark" : ""}` : ""} ${reduceMotion ? "reduce-motion" : ""} ${dyslexiaFont ? "dyslexia-font" : ""} ${readableSpacing ? "readable-spacing" : ""} ${reduceTransparency ? "reduce-transparency" : ""} ${focusIndicators ? "focus-indicators" : ""}`}>
            {children}

            {!isMobileView && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full z-40 opacity-70" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
