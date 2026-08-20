import { EXPERIENCE_SALARY_BANDS, MS_IN_DAY, SALARY_FILTER_MIN } from "../listings/constants";
import { Job } from "../listings/types";

export type ExploreSelectorInput = {
  exploreQuery: string;
  exploreCategory: string;
  isAdvSearchApplied: boolean;
  advKeyword: string;
  advLocation: string;
  advExp: keyof typeof EXPERIENCE_SALARY_BANDS | null;
  advTypes: string[];
  advSalaryMin: number;
  advDate: string;
  advSkills: string[];
  nowMs: number;
};

// Map categories to keywords that should match in job titles
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Accountant": ["accountant", "accounting", "audit", "finance", "bookkeeper"],
  "Admin": ["admin", "administrator", "office", "support", "coordinator"],
  "Analyst": ["analyst", "data", "business", "research"],
  "Architect": ["architect", "design", "infrastructure"],
  "Artisan": ["artisan", "craftsman", "craft", "maker"],
  "Assistant": ["assistant", "support", "associate"],
  "Chef": ["chef", "cook", "food", "culinary"],
  "Clerk": ["clerk", "clerical", "office", "receptionist"],
  "Construction": ["construction", "builder", "building", "site", "civil"],
  "Design": ["design", "designer", "ui", "ux", "graphic"],
  "Director": ["director", "director", "head", "senior"],
  "Driver": ["driver", "delivery", "logistics", "transport", "operator"],
  "Engineering": ["engineer", "engineering", "developer", "software", "tech"],
  "Finance": ["finance", "financial", "accountant", "analyst", "treasury"],
  "Handyman": ["handyman", "maintenance", "repair", "technician", "maintenance"],
  "Healthcare": ["nurse", "doctor", "healthcare", "medical", "health"],
  "Human Resource": ["hr", "human resource", "recruiter", "recruitment"],
  "Inspector": ["inspector", "inspection", "auditor", "compliance"],
  "Internship": ["intern", "internship", "graduate", "trainee"],
  "IT Support": ["it support", "support", "helpdesk", "tech support", "systems"],
  "Learnership": ["learner", "learnership", "apprentice", "apprenticeship"],
  "Logistics": ["logistics", "supply chain", "warehouse", "distribution"],
  "Manager": ["manager", "management", "lead", "supervisor"],
  "Marketing": ["marketing", "marketer", "brand", "social", "campaign"],
  "Mechanic": ["mechanic", "mechanical", "automotive", "technician"],
  "Nurse": ["nurse", "nursing", "healthcare", "medical"],
  "Officer": ["officer", "executive", "sales", "operations"],
  "Sales": ["sales", "salesman", "representative", "account executive"],
  "Supervisor": ["supervisor", "lead", "team lead", "foreman"],
  "Surveyor": ["surveyor", "surveying", "land", "civil"],
  "Teacher": ["teacher", "teaching", "educator", "instructor"],
  "Technician": ["technician", "technical", "maintenance", "support"],
  "Trades": ["trades", "tradesman", "plumber", "electrician", "carpenter"],
  "Pharmacist": ["pharmacist", "pharmacy", "pharmaceutical"]
};

function matchesCategoryByTitle(jobTitle: string, category: string): boolean {
  const keywords = CATEGORY_KEYWORDS[category] || [];
  const lowerTitle = jobTitle.toLowerCase();
  return keywords.some(keyword => lowerTitle.includes(keyword));
}

function normalizeEmploymentType(value: string): string {
  const normalized = value.toLowerCase().trim();
  const contains = (keywords: string[]) => keywords.some(keyword => normalized.includes(keyword));

  if (contains(["graduate", "grad programme", "grad program"])) return "Graduate";
  if (contains(["internship", "intern ", "intern-"])) return "Internship";
  if (contains(["part-time", "part time"])) return "Part-time";
  if (contains(["remote", "work from home", "wfh"])) return "Remote";
  if (contains(["hybrid"])) return "Hybrid";
  if (contains(["contract", "fixed-term", "fixed term", "temporary"])) return "Contract";
  if (contains(["permanent", "full-time", "full time"])) return "Permanent";

  return "Unspecified";
}

const DATE_FILTER_WINDOWS_MS: Record<string, number> = {
  "Past 24 hours": MS_IN_DAY,
  "Past week": MS_IN_DAY * 7,
  "Past month": MS_IN_DAY * 30
};

// "Any time" (or an unrecognized value) means no filtering. For a specific
// window, a job with a missing/unparseable posted date is excluded rather
// than assumed recent — we can't verify it belongs in the window.
function matchesDatePosted(datePosted: string, selectedWindow: string, nowMs: number): boolean {
  const windowMs = DATE_FILTER_WINDOWS_MS[selectedWindow];
  if (!windowMs) return true;

  const postedMs = new Date(datePosted).getTime();
  if (Number.isNaN(postedMs)) return false;

  const ageMs = nowMs - postedMs;
  return ageMs >= 0 && ageMs <= windowMs;
}

// Reads the min and max figures out of a salary string, as whole Rand amounts.
// Real listings group thousands with a space ("R237 453 per annum") far more
// often than with a comma ("R135,000"), so both are treated as digit-group
// separators. Also handles "k" shorthand ("R90k - R130k"), open-ended figures
// ("R800,000+"), and single fixed figures ("R487 197 per annum"). Standalone
// small numbers (years of experience, "Level 05", grade numbers) are ignored
// so they aren't mistaken for a currency figure. Returns null when no usable
// number can be found at all (e.g. "Market related", "Confirmed during the
// application process") — the first two qualifying numbers found in the
// string are taken as min/max.
function parseJobSalaryRange(salary: string): { min: number; max: number } | null {
  if (!salary) return null;

  const matches = Array.from(salary.matchAll(/(\d+(?:[,\s]\d{3})*(?:\.\d+)?)\s*(k)?(\+)?/gi));

  const candidates = matches
    .map(match => {
      const numeric = parseFloat(match[1].replace(/[,\s]/g, ""));
      if (!Number.isFinite(numeric) || numeric <= 0) return null;

      const hasKSuffix = Boolean(match[2]);
      // Below R100 with no "k" suffix is almost certainly not a currency
      // figure (e.g. "5 years", "Level 05") rather than a real salary.
      if (numeric < 100 && !hasKSuffix) return null;

      return {
        amount: hasKSuffix ? numeric * 1000 : numeric,
        openEnded: Boolean(match[3])
      };
    })
    .filter((candidate): candidate is { amount: number; openEnded: boolean } => candidate !== null);

  if (candidates.length === 0) return null;

  const min = candidates[0].amount;
  if (candidates.length === 1) {
    return { min, max: candidates[0].openEnded ? Number.POSITIVE_INFINITY : min };
  }

  const max = candidates[1].amount;
  return max >= min ? { min, max } : { min, max: min };
}

export function filterExploreJobs(activeJobs: Job[], input: ExploreSelectorInput): Job[] {
  const activeExperienceBand = input.advExp ? EXPERIENCE_SALARY_BANDS[input.advExp] : null;
  const isExperienceSearchActive = input.isAdvSearchApplied && activeExperienceBand !== null;

  return activeJobs.filter(job => {
    // Safe search that handles null/undefined values
    const searchTerm = input.exploreQuery.toLowerCase().trim();
    const matchesSearch = !searchTerm || 
      (job.title && job.title.toLowerCase().includes(searchTerm)) ||
      (job.company && job.company.toLowerCase().includes(searchTerm)) ||
      (job.location && job.location.toLowerCase().includes(searchTerm));

    const matchesCategory = input.exploreCategory === "All" ||
      job.category === input.exploreCategory ||
      matchesCategoryByTitle(job.title || "", input.exploreCategory);

    const jobSalaryRange = parseJobSalaryRange(job.salary);

    if (isExperienceSearchActive && activeExperienceBand) {
      if (!jobSalaryRange) return false;
      // Overlap check: the job's salary band intersects the experience band.
      return jobSalaryRange.min <= activeExperienceBand.max && jobSalaryRange.max >= activeExperienceBand.min;
    }

    let matchesAdv = true;
    if (input.isAdvSearchApplied) {
      const advKMatch = !input.advKeyword ||
        job.title.toLowerCase().includes(input.advKeyword.toLowerCase()) ||
        job.company.toLowerCase().includes(input.advKeyword.toLowerCase());

      const advLMatch = !input.advLocation || job.location.toLowerCase().includes(input.advLocation.toLowerCase());
      const advTMatch = input.advTypes.length === 0 || input.advTypes.includes(normalizeEmploymentType(job.type || ""));
      // The slider's floor (SALARY_FILTER_MIN) means "no salary preference" —
      // plenty of real listings have no salary in the database at all, and
      // those shouldn't vanish just because Advanced Search was applied. Only
      // once the user raises the floor above the default do we start requiring
      // a known salary that actually reaches it (the slider's ceiling is
      // unbounded — "R750,000+" — so a job qualifies whenever any part of its
      // DB salary range reaches the chosen floor).
      const advSMatch = input.advSalaryMin <= SALARY_FILTER_MIN ||
        (jobSalaryRange !== null && jobSalaryRange.max >= input.advSalaryMin);
      const advDMatch = matchesDatePosted(job.datePosted, input.advDate, input.nowMs);

      const advSkillsMatch = input.advSkills.length === 0 || input.advSkills.every(skill =>
        job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase())) ||
        job.description.toLowerCase().includes(skill.toLowerCase()) ||
        job.title.toLowerCase().includes(skill.toLowerCase())
      );

      matchesAdv = advKMatch && advLMatch && advTMatch && advSMatch && advDMatch && advSkillsMatch;
    }

    return matchesSearch && matchesCategory && matchesAdv;
  });
}
