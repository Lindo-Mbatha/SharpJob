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

export function filterExploreJobs(activeJobs: Job[], input: ExploreSelectorInput): Job[] {
  const activeExperienceBand = input.advExp ? EXPERIENCE_SALARY_BANDS[input.advExp] : null;
  const isExperienceSearchActive = input.isAdvSearchApplied && activeExperienceBand !== null;

  return activeJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(input.exploreQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(input.exploreQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(input.exploreQuery.toLowerCase());

    const matchesCategory = input.exploreCategory === "All" || job.category === input.exploreCategory;
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
