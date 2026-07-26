import { EXPERIENCE_SALARY_BANDS } from "../listings/constants";
import { Job } from "../listings/types";

export type ExploreSelectorInput = {
  exploreQuery: string;
  exploreCategory: string;
  exploreType: string;
  isAdvSearchApplied: boolean;
  advKeyword: string;
  advLocation: string;
  advExp: keyof typeof EXPERIENCE_SALARY_BANDS | null;
  advTypes: string[];
  advSalaryMin: number;
  advSkills: string[];
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
    const matchesType = input.exploreType === "All" || job.type === input.exploreType;

    const jobMinSalaryStr = job.salary.split("-")[0].replace(/[^0-9]/g, "");
    const jobMinSalary = jobMinSalaryStr ? parseInt(jobMinSalaryStr) / 1000 : 0;

    if (isExperienceSearchActive && activeExperienceBand) {
      return jobMinSalary >= activeExperienceBand.min && jobMinSalary <= activeExperienceBand.max;
    }

    let matchesAdv = true;
    if (input.isAdvSearchApplied) {
      const advKMatch = !input.advKeyword ||
        job.title.toLowerCase().includes(input.advKeyword.toLowerCase()) ||
        job.company.toLowerCase().includes(input.advKeyword.toLowerCase());

      const advLMatch = !input.advLocation || job.location.toLowerCase().includes(input.advLocation.toLowerCase());
      const advTMatch = input.advTypes.length === 0 || input.advTypes.includes(job.type);
      const advSMatch = jobMinSalary >= input.advSalaryMin;

      const advSkillsMatch = input.advSkills.length === 0 || input.advSkills.every(skill =>
        job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase())) ||
        job.description.toLowerCase().includes(skill.toLowerCase()) ||
        job.title.toLowerCase().includes(skill.toLowerCase())
      );

      matchesAdv = advKMatch && advLMatch && advTMatch && advSMatch && advSkillsMatch;
    }

    return matchesSearch && matchesCategory && matchesType && matchesAdv;
  });
}
