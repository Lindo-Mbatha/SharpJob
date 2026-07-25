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

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadState, setLoadState] = useState<JobsLoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchJobs = async () => {
      setLoadState("loading");
      setError(null);

      const { data, error: sbError } = await supabase
        .from("Jobs")
        .select("*")
        .order("id", { ascending: true });

      if (cancelled) return;

      if (sbError) {
        console.error('[SharpJob] useJobs fetch error:', sbError.message, sbError);
        setError(sbError.message);
        setLoadState("error");
        return;
      }

      const mapped = (data ?? []).map(row => mapRow(row as Record<string, unknown>));
      setJobs(mapped);
      setLoadState("success");
    };

    void fetchJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  return { jobs, setJobs, loadState, error };
}
