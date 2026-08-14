export type AlertKind = "match" | "interview" | "viewed" | "reminder" | "system" | "profile";
export type AlertCategory = "general" | "system" | "headline";

export interface AlertNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  jobId?: string;
  kind?: AlertKind;
  category?: AlertCategory;
}
