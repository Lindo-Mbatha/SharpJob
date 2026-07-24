export interface Job {
  id: string;
  title: string;
  company: string;
  category: "Design" | "Engineering" | "Marketing" | "Product" | "Finance";
  location: string;
  type: "Full-time" | "Contract" | "Remote" | "Hybrid";
  salary: string;
  closes: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  companyBio: string;
  isSaved?: boolean;
  isApplied?: boolean;
  appliedStatus?: "Submitted" | "Screening" | "Interviewing" | "Offer Given" | "Archived";
  appliedDate?: string;
  applyUrl?: string;
}

export interface PreviousSavedListing {
  job: Job;
  closedDate: Date;
  expiresAt: Date;
  daysSinceClosed: number;
  daysUntilArchive: number;
}
