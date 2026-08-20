import { trackEvent } from "./telemetry";

export interface ApplySubmittedPayload {
  job_id: string;
  company: string;
  category: string;
  tab: string;
}

export interface ProfileSavedPayload {
  skills_count: number;
  has_headline: boolean;
  has_location: boolean;
  strength: string;
}

export interface AdvancedSearchAppliedPayload {
  keyword: string;
  location: string;
  experience: string;
  types_count: number;
  min_salary: number;
  date_posted: string;
  skills_count: number;
}

export function trackApplySubmitted(payload: ApplySubmittedPayload) {
  trackEvent("apply_submitted", { ...payload });
}

export function trackProfileSaved(payload: ProfileSavedPayload) {
  trackEvent("profile_saved", { ...payload });
}

export function trackAdvancedSearchApplied(payload: AdvancedSearchAppliedPayload) {
  trackEvent("advanced_search_applied", { ...payload });
}
