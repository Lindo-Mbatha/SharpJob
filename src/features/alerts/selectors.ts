import { AlertNotification } from "./types";

export function countUnreadAlerts(notifications: AlertNotification[]): number {
  return notifications.filter(n => !n.read).length;
}

// Estimated on-device storage (in bytes) used by the cached alert history.
export function getNotificationsStorageBytes(notifications: AlertNotification[]): number {
  if (notifications.length === 0) return 0;
  try {
    return new TextEncoder().encode(JSON.stringify(notifications)).length;
  } catch {
    return 0;
  }
}

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// "Just now" for the first minute, the exact clock time for the rest of that day,
// then a growing day count from there.
export function formatAlertTime(createdAt: number, now: number = Date.now()): string {
  const elapsedMs = Math.max(0, now - createdAt);

  if (elapsedMs < MINUTE_MS) return "Just now";

  if (elapsedMs < DAY_MS) {
    return new Date(createdAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  const days = Math.floor(elapsedMs / DAY_MS);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
