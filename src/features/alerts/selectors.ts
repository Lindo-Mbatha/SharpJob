import { AlertNotification } from "./types";

export function countUnreadAlerts(notifications: AlertNotification[]): number {
  return notifications.filter(n => !n.read).length;
}
