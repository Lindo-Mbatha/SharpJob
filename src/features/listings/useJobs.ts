import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Job } from "./types";

// Splits a text string into a trimmed array, supporting newlines or commas.
function parseTextToArray(value: unknown): string[] {
  if (Array.isArray(value)) return (value as string[]).filter(Boolean);
  if (typeof value !== "string" || !value.trim()) return [];
  const separator = value.includes("\n") ? "\n" : ",";
  return value.split(separator).map(s => s.trim()).filter(Boolean);
}

// Formats a Supabase date string (YYYY-MM-DD) to a readable "MMM DD, YYYY" label.
function formatDeadline(value: unknown): string {
  if (!value) return "";
  const d = new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Maps a Supabase row to the app's Job shape using your exact column names.
function mapRow(row: Record<string, unknown>): Job {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    company: String(row.company ?? ""),
    category: (row.category as Job["category"]) ?? "Engineering",
    location: String(row.location ?? ""),
    type: (row.employment_type as Job["type"]) ?? "Full-time",
    salary: String(row.salary_range ?? ""),
    closes: formatDeadline(row.deadline),
    description: String(row.overview ?? ""),
    responsibilities: parseTextToArray(row.responsibilities),
    requirements: parseTextToArray(row.requirements),
    companyBio: String(row.about_company ?? ""),
    companyLogoUrl: row.company_logo_url ? String(row.company_logo_url) : undefined,
    applyUrl: row.apply_url ? String(row.apply_url) : undefined,
  };
}

export type JobsLoadState = "idle" | "loading" | "success" | "error";

const SUPABASE_BATCH_SIZE = 1000;

async function fetchAllJobs() {
  const rows: Record<string, unknown>[] = [];

  for (let start = 0; ; start += SUPABASE_BATCH_SIZE) {
    const { data, error } = await supabase
      .from("Jobs")
      .select("*")
      .order("id", { ascending: true })
      .range(start, start + SUPABASE_BATCH_SIZE - 1);

    if (error) return { rows: null, error };

    const batch = (data ?? []) as Record<string, unknown>[];
    rows.push(...batch);

    if (batch.length < SUPABASE_BATCH_SIZE) {
      return { rows, error: null };
    }
  }
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadState, setLoadState] = useState<JobsLoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchJobs = async () => {
      setLoadState("loading");
      setError(null);

      const { rows, error: sbError } = await fetchAllJobs();

      if (cancelled) return;

      if (sbError) {
        console.error('[SharpJob] useJobs fetch error:', sbError.message, sbError);
        setError(sbError.message);
        setLoadState("error");
        return;
      }

      const mapped = (rows ?? []).map(row => mapRow(row));
      setJobs(previousJobs => {
        const localStateByJobId = new Map(previousJobs.map(job => [job.id, job]));

        return mapped.map(job => {
          const localJob = localStateByJobId.get(job.id);
          if (!localJob) return job;

          return {
            ...job,
            isSaved: localJob.isSaved,
            isApplied: localJob.isApplied,
            appliedStatus: localJob.appliedStatus,
            appliedDate: localJob.appliedDate,
            interviewTrackerStatus: localJob.interviewTrackerStatus,
            interviewDate: localJob.interviewDate
          };
        });
      });
      setLoadState("success");
    };

    void fetchJobs();
    const refreshTimer = window.setInterval(() => {
      void fetchJobs();
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, []);

  return { jobs, setJobs, loadState, error };
}
