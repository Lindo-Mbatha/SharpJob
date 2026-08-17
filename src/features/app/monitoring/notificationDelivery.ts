import { NotificationFrequency } from "../types/domain";

function minutesSinceMidnight(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return 0;
  return hours * 60 + minutes;
}

function atMinutes(base: Date, minutes: number): Date {
  const next = new Date(base);
  next.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return next;
}

function isWithinQuietHours(nowMinutes: number, quietFrom: number, quietTo: number): boolean {
  if (quietFrom === quietTo) return false;
  return quietFrom < quietTo
    ? nowMinutes >= quietFrom && nowMinutes < quietTo
    : nowMinutes >= quietFrom || nowMinutes < quietTo;
}

export function getNotificationDeliveryTime(
  frequency: NotificationFrequency,
  quietFrom: string,
  quietTo: string,
  now = new Date()
): Date {
  const quietFromMinutes = minutesSinceMidnight(quietFrom);
  const quietToMinutes = minutesSinceMidnight(quietTo);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (isWithinQuietHours(nowMinutes, quietFromMinutes, quietToMinutes)) {
    const quietEnds = atMinutes(now, quietToMinutes);
    if (quietEnds <= now) quietEnds.setDate(quietEnds.getDate() + 1);
    return quietEnds;
  }

  if (frequency === "instant") return now;
  if (frequency === "hourly") {
    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);
    return nextHour;
  }

  const nextMorning = new Date(now);
  nextMorning.setDate(nextMorning.getDate() + 1);
  nextMorning.setHours(9, 0, 0, 0);
  return nextMorning;
}
