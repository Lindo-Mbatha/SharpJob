import React from "react";
import { BellRing, Bookmark, Briefcase, Search, User } from "lucide-react";
import { AppTab } from "../app/types/domain";

export function BottomNavigationBar({
  isMobileView,
  darkMode,
  activeTab,
  activeAccentText,
  activeAccentPrimary,
  savedVisibleCount,
  unreadAlertsCount,
  onSelectTab
}: {
  isMobileView: boolean;
  darkMode: boolean;
  activeTab: AppTab;
  activeAccentText: string;
  activeAccentPrimary: string;
  savedVisibleCount: number;
  unreadAlertsCount: number;
  onSelectTab: (tab: AppTab) => void;
}) {
  const items: Array<{
    key: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: "home", label: "Home", icon: Briefcase },
    { key: "explore", label: "Explore", icon: Search },
    { key: "saved", label: "Saved", icon: Bookmark },
    { key: "alerts", label: "Alerts", icon: BellRing },
    { key: "profile", label: "Profile", icon: User }
  ];

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 ${isMobileView ? "h-20" : "h-16"} border-t flex items-center justify-around select-none z-30 transition-all ${
        darkMode
          ? "bg-slate-950 border-slate-900 text-slate-400"
          : "bg-white border-slate-200/60 text-slate-500"
      }`}
      style={{ borderTopLeftRadius: isMobileView ? "0px" : "12px", borderTopRightRadius: isMobileView ? "0px" : "12px" }}
    >
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelectTab(key)}
          className={`flex flex-col items-center justify-center gap-1 ${isMobileView ? "w-16 h-16" : "w-12 h-12"} transition-all${
            key === "saved" || key === "alerts" ? " relative" : ""
          }`}
        >
          <Icon
            className={`${isMobileView ? "h-5 w-5" : "h-4.5 w-4.5"} transition-colors ${
              activeTab === key
                ? `${activeAccentText} stroke-[2.5px]`
                : "text-slate-400 dark:text-slate-500"
            }`}
          />

          {key === "saved" && savedVisibleCount > 0 && (
            <span className={`absolute top-1.5 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${activeAccentPrimary}`}>
              {savedVisibleCount}
            </span>
          )}

          {key === "alerts" && unreadAlertsCount > 0 && (
            <span className={`absolute top-0.5 right-1 min-w-[14px] h-[14px] px-1 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-white ${activeAccentPrimary}`}>
              {unreadAlertsCount}
            </span>
          )}

          <span
            className={`${isMobileView ? "text-[11px]" : "text-[10px]"} tracking-tight transition-all font-medium ${
              activeTab === key
                ? `${activeAccentText} font-bold`
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
