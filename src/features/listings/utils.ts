import { Briefcase, Megaphone, Palette, Server } from "lucide-react";
import { MS_IN_DAY, PREVIOUS_LISTING_RETENTION_DAYS } from "./constants";
import { Job, PreviousSavedListing } from "./types";

const COMPANY_CAREERS: Record<string, string> = {
  Airbnb: "https://careers.airbnb.com/",
  Stripe: "https://stripe.com/jobs",
  HubSpot: "https://www.hubspot.com/careers",
  Snowflake: "https://careers.snowflake.com/",
  Duolingo: "https://careers.duolingo.com/",
  Canva: "https://www.canva.com/careers/",
  Google: "https://careers.google.com/",
  Netflix: "https://jobs.netflix.com/",
  Figma: "https://www.figma.com/careers/"
};

export const getVisiblePageChips = (currentPage: number, totalPages: number): Array<number | "ellipsis"> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < totalPages - 1) pages.push("ellipsis");

  pages.push(totalPages);
  return pages;
};

export const displayOrFallback = (value: string | null | undefined): string => {
  return value && value.trim() ? value : "Not provided";
};

export const parseJobCloseDate = (closes: string): Date | null => {
  const parsed = new Date(closes);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(23, 59, 59, 999);
  return parsed;
};

export const deriveApplyUrl = (job: Job): string => {
  if (job.applyUrl) return job.applyUrl;
  const known = COMPANY_CAREERS[job.company];
  if (known) return known;
  return `https://www.google.com/search?q=${encodeURIComponent(`${job.company} ${job.title} careers apply`)}`;
};

export const getCategoryStyles = (category: string) => {
  const norm = category.toLowerCase();
  if (norm.includes("design") || norm.includes("creative") || norm.includes("ui") || norm.includes("ux")) {
    return {
      bg: "bg-blue-50/70 text-blue-600 border-blue-100",
      icon: Palette,
      label: "Design"
    };
  }
  if (norm.includes("engineer") || norm.includes("developer") || norm.includes("tech") || norm.includes("backend") || norm.includes("frontend") || norm.includes("code") || norm.includes("data") || norm.includes("cloud")) {
    return {
      bg: "bg-purple-50/70 text-purple-600 border-purple-100",
      icon: Server,
      label: "Engineering"
    };
  }
  if (norm.includes("marketing") || norm.includes("sales") || norm.includes("growth") || norm.includes("social") || norm.includes("brand")) {
    return {
      bg: "bg-emerald-50/70 text-emerald-600 border-emerald-100",
      icon: Megaphone,
      label: "Marketing"
    };
  }
  return {
    bg: "bg-amber-50/70 text-amber-600 border-amber-100",
    icon: Briefcase,
    label: category
  };
};

export const getPreviousSavedListings = (savedJobs: Job[], nowMs: number): PreviousSavedListing[] => {
  return savedJobs
    .map(job => {
      const closedDate = parseJobCloseDate(job.closes);
      if (!closedDate) return null;

      const closedMs = closedDate.getTime();
      const expiresMs = closedMs + (PREVIOUS_LISTING_RETENTION_DAYS * MS_IN_DAY);
      if (nowMs <= closedMs || nowMs > expiresMs) return null;

      return {
        job,
        closedDate,
        expiresAt: new Date(expiresMs),
        daysSinceClosed: Math.max(1, Math.floor((nowMs - closedMs) / MS_IN_DAY)),
        daysUntilArchive: Math.max(0, Math.ceil((expiresMs - nowMs) / MS_IN_DAY))
      };
    })
    .filter((entry): entry is PreviousSavedListing => entry !== null)
    .sort((a, b) => b.closedDate.getTime() - a.closedDate.getTime());
};

export const getActiveSavedJobs = (savedJobs: Job[], nowMs: number): Job[] => {
  return savedJobs.filter(job => {
    const closedDate = parseJobCloseDate(job.closes);
    if (!closedDate) return true;
    return nowMs <= closedDate.getTime();
  });
};

export const getActiveJobs = (jobs: Job[], nowMs: number): Job[] => {
  return jobs.filter(job => {
    const closedDate = parseJobCloseDate(job.closes);
    if (!closedDate) return true;
    return nowMs <= closedDate.getTime();
  });
};
