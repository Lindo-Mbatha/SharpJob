import React from "react";
import { ArrowLeft, BellRing, Check, ChevronRight, Trash2 } from "lucide-react";
import { AlertNotification } from "../alerts/types";
import { AlertCategory } from "../alerts/types";
import { Job } from "../listings/types";
import { getCategoryStyles } from "../listings/utils";
import { AlertsFilter } from "../app/types/domain";

export function AlertsTabScreen({
  darkMode,
  activeAccentText,
  activeAccentPrimary,
  notifications,
  selectedNotificationId,
  alertsFilter,
  jobs,
  setSelectedNotificationId,
  setAlertsFilter,
  setNotifications,
  setSelectedJob,
  triggerNotification
}: {
  darkMode: boolean;
  activeAccentText: string;
  activeAccentPrimary: string;
  notifications: AlertNotification[];
  selectedNotificationId: string | null;
  alertsFilter: AlertsFilter;
  jobs: Job[];
  setSelectedNotificationId: React.Dispatch<React.SetStateAction<string | null>>;
  setAlertsFilter: React.Dispatch<React.SetStateAction<AlertsFilter>>;
  setNotifications: React.Dispatch<React.SetStateAction<AlertNotification[]>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
  triggerNotification: (message: string) => void;
}) {
  const getAlertCategory = (notification: AlertNotification): AlertCategory => {
    if (notification.category) return notification.category;
    if (notification.kind === "match") return "headline";
    return "system";
  };

  const selectedNotif = selectedNotificationId ? notifications.find(n => n.id === selectedNotificationId) || null : null;
  const visibleNotifs = notifications.filter(n => {
    if (alertsFilter === "unread") return !n.read;
    if (alertsFilter === "all") return true;
    return getAlertCategory(n) === alertsFilter;
  });
  const unreadCount = notifications.filter(n => !n.read).length;
  const linkedJob = selectedNotif?.jobId ? jobs.find(j => j.id === selectedNotif.jobId) || null : null;
  const filterDragRef = React.useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  }>({ active: false, pointerId: null, startX: 0, startScrollLeft: 0, moved: false });
  const suppressFilterClickRef = React.useRef(false);

  const onFilterPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    filterDragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      moved: false
    };
  };

  const onFilterPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = filterDragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(deltaX) < 8) return;
    if (!drag.moved) {
      drag.moved = true;
      suppressFilterClickRef.current = true;
    }
    event.currentTarget.scrollLeft = drag.startScrollLeft - deltaX;
    event.preventDefault();
  };

  const onFilterPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (filterDragRef.current.pointerId !== event.pointerId) return;
    filterDragRef.current.active = false;
    filterDragRef.current.pointerId = null;
  };

  const onFilterClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressFilterClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressFilterClickRef.current = false;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {!selectedNotif && (
        <div className="p-5 space-y-4 flex-1 flex flex-col animate-fade-in">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                Alerts
                {unreadCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white ${activeAccentPrimary}`}>
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Every match, view and interview - in one place.
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${activeAccentText}`}
              >
                Mark all read
              </button>
            )}
          </div>

          <div
            className="min-w-0 max-w-full flex items-center gap-1.5 select-none overflow-x-auto overflow-y-hidden no-scrollbar pb-1 flex-nowrap cursor-grab active:cursor-grabbing"
            onPointerDown={onFilterPointerDown}
            onPointerMove={onFilterPointerMove}
            onPointerUp={onFilterPointerEnd}
            onPointerCancel={onFilterPointerEnd}
            onClickCapture={onFilterClickCapture}
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x", overscrollBehaviorX: "contain" }}
          >
            {(["all", "general", "system", "headline", "unread"] as const).map(f => {
              const isActive = alertsFilter === f;
              const count = f === "all"
                ? notifications.length
                : f === "unread"
                  ? unreadCount
                  : notifications.filter(notification => getAlertCategory(notification) === f).length;
              const label = f === "all" ? "All" : f === "unread" ? "Unread" : f.charAt(0).toUpperCase() + f.slice(1);
              return (
                <button
                  key={f}
                  onClick={() => setAlertsFilter(f)}
                  className={`touch-target shrink-0 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                    isActive
                      ? `${activeAccentPrimary} text-white border-transparent`
                      : (darkMode
                          ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100")
                  }`}
                >
                  {label}
                  <span className={`text-[9px] px-1 rounded-full ${
                    isActive ? "bg-white/20" : (darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-500")
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar -mx-1 px-1">
            {visibleNotifs.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <BellRing className="h-10 w-10 text-slate-500 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">
                  {alertsFilter === "unread" ? "Inbox zero - nicely done." : `No ${alertsFilter === "all" ? "" : `${alertsFilter} `}alerts yet.`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {alertsFilter === "unread"
                    ? "You've read everything. New matches and updates will land here."
                    : "Matches, interview requests and profile tips will show up here."}
                </p>
              </div>
            ) : visibleNotifs.map((n, idx) => (
              <button
                key={n.id}
                  aria-label={`${n.read ? "Read" : "Unread"} alert: ${n.title}. ${n.desc}`}
                onClick={() => {
                  setSelectedNotificationId(n.id);
                  setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                }}
                style={{ animationDelay: `${idx * 40}ms` }}
                className={`w-full text-left rounded-xl border p-3.5 transition-all group relative overflow-hidden animate-fade-in ${
                  !n.read
                    ? (darkMode
                        ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                        : "bg-white border-slate-200/80 hover:border-slate-300")
                    : (darkMode
                        ? "bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80"
                        : "bg-white/60 border-slate-200/40 hover:border-slate-200")
                }`}
              >
                {!n.read && (
                  <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${activeAccentPrimary}`} />
                )}

                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 border ${
                    n.kind === "match" ? "bg-indigo-50 border-indigo-100" :
                    n.kind === "interview" ? "bg-emerald-50 border-emerald-100" :
                    n.kind === "viewed" ? "bg-amber-50 border-amber-100" :
                    n.kind === "reminder" ? "bg-rose-50 border-rose-100" :
                    n.kind === "profile" ? "bg-sky-50 border-sky-100" :
                    "bg-slate-50 border-slate-100"
                  }`}>
                    {n.kind === "match" ? "✨" :
                     n.kind === "interview" ? "📅" :
                     n.kind === "viewed" ? "👀" :
                     n.kind === "reminder" ? "⏰" :
                     n.kind === "profile" ? "💪" : "🔔"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-[13px] font-bold truncate flex items-center gap-1.5 ${
                        !n.read
                          ? (darkMode ? "text-white" : "text-slate-900")
                          : (darkMode ? "text-slate-300" : "text-slate-700")
                      }`}>
                        {n.title}
                        {!n.read && (
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeAccentPrimary}`} />
                        )}
                      </h4>
                      <span className="text-[9px] text-slate-400 shrink-0 font-semibold tracking-wide">
                        {n.time}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {getAlertCategory(n)} alert
                    </span>
                    <p className={`mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2 ${
                      !n.read ? (darkMode ? "text-slate-300" : "text-slate-600") : ""
                    }`}>
                      {n.desc}
                    </p>
                  </div>

                  <ChevronRight className={`h-4 w-4 shrink-0 mt-2 transition-transform ${
                    activeAccentText
                  } group-hover:translate-x-0.5`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedNotif && (
        <div className={`absolute inset-0 flex flex-col animate-slide-up ${
          darkMode ? "bg-slate-950" : "bg-white"
        }`}>
          <div className={`h-12 px-3 flex items-center justify-between border-b shrink-0 ${
            darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
          }`}>
            <button
              onClick={() => setSelectedNotificationId(null)}
              className={`flex items-center gap-1 text-xs font-semibold ${activeAccentText}`}
            >
              <ArrowLeft className="h-4 w-4" />
              Alerts
            </button>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Message
            </span>
            <button
              onClick={() => {
                setNotifications(prev => prev.filter(x => x.id !== selectedNotif.id));
                setSelectedNotificationId(null);
                triggerNotification("Alert dismissed.");
              }}
              aria-label="Delete alert"
              className="p-1.5 text-slate-400 hover:text-red-500"
              title="Dismiss"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                selectedNotif.kind === "match" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                selectedNotif.kind === "interview" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                selectedNotif.kind === "viewed" ? "bg-amber-50 text-amber-700 border-amber-100" :
                selectedNotif.kind === "reminder" ? "bg-rose-50 text-rose-700 border-rose-100" :
                selectedNotif.kind === "profile" ? "bg-sky-50 text-sky-700 border-sky-100" :
                "bg-slate-50 text-slate-600 border-slate-200"
              }`}>
                {getAlertCategory(selectedNotif)} alert
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">{selectedNotif.time}</span>
              {selectedNotif.read && (
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider ml-auto flex items-center gap-1">
                  <Check className="h-3 w-3" /> read
                </span>
              )}
            </div>

            <h2 className={`text-[22px] font-extrabold leading-tight tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}>
              {selectedNotif.title}
            </h2>

            <div className={`border-t ${darkMode ? "border-slate-850" : "border-slate-100"}`} />

            <p className={`text-[13px] leading-[1.7] ${
              darkMode ? "text-slate-200" : "text-slate-700"
            }`}>
              {selectedNotif.desc}
            </p>

            {linkedJob && (
              <button
                onClick={() => {
                  setSelectedJob(linkedJob);
                }}
                className={`w-full text-left rounded-xl border p-3 transition-all hover:-translate-y-0.5 ${
                  darkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                    getCategoryStyles(linkedJob.category).bg
                  }`}>
                    {React.createElement(getCategoryStyles(linkedJob.category).icon, { className: "h-5 w-5" })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Related opening
                    </p>
                    <p className={`text-xs font-bold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {linkedJob.title} • {linkedJob.company}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {linkedJob.location} • {linkedJob.salary}
                    </p>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${activeAccentText}`} />
                </div>
              </button>
            )}

            <div className={`p-3 rounded-xl border ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                From SharpJob
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {selectedNotif.kind === "match" && "We match you to roles using your saved skills, target salary and location preferences. Tune any of those from the Profile tab to refine future alerts."}
                {selectedNotif.kind === "interview" && "Interview confirmations are mirrored to your primary email. If you don't see the calendar invite within 5 minutes, check spam or tap 'Resend' from the email itself."}
                {selectedNotif.kind === "viewed" && "A 'viewed' event means a human recruiter opened your application inside their ATS. Response rates are highest within the first 72 hours of a view."}
                {selectedNotif.kind === "reminder" && "Closing-date reminders are scheduled for Saved for later jobs 3, 2, and 1 day before each role closes."}
                {selectedNotif.kind === "profile" && "Profile Strength is calculated from completed fields, verified skills and uploaded assets. A 100% profile gets prioritised in recruiter search results."}
                {selectedNotif.kind === "system" && "Need help? Our support team replies within one business day from the Profile tab → Help & Feedback."}
                {!selectedNotif.kind && "This is a general product update from the SharpJob team."}
              </p>
            </div>
          </div>

          <div className={`p-3 border-t flex items-center gap-2 shrink-0 ${
            darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
          }`}>
            <button
              onClick={() => {
                setNotifications(prev => prev.map(x => x.id === selectedNotif.id ? { ...x, read: !x.read } : x));
              }}
              className={`h-10 px-3 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${
                darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-900" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {selectedNotif.read ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Mark unread</>
              ) : (
                <><Check className="h-3.5 w-3.5" /> Mark read</>
              )}
            </button>
            <button
              onClick={() => {
                setNotifications(prev => prev.filter(x => x.id !== selectedNotif.id));
                setSelectedNotificationId(null);
              }}
              className={`h-10 px-3 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${
                darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-900" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" /> Dismiss
            </button>
            {linkedJob ? (
              <button
                onClick={() => setSelectedJob(linkedJob)}
                className={`flex-1 h-10 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 ${activeAccentPrimary}`}
              >
                View job <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setSelectedNotificationId(null)}
                className={`flex-1 h-10 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 ${activeAccentPrimary}`}
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
