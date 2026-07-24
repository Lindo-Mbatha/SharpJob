import { useEffect, useState } from "react";
import { EXPERIENCE_SALARY_BANDS } from "../../listings/constants";

export function useExploreFilters() {
  const [exploreQuery, setExploreQuery] = useState<string>("");
  const [exploreCategory, setExploreCategory] = useState<string>("All");
  const [exploreType, setExploreType] = useState<string>("All");

  const [isAdvSearchOpen, setIsAdvSearchOpen] = useState<boolean>(false);
  const [isAdvSearchApplied, setIsAdvSearchApplied] = useState<boolean>(false);
  const [advKeyword, setAdvKeyword] = useState<string>("");
  const [advLocation, setAdvLocation] = useState<string>("");
  const [advExp, setAdvExp] = useState<keyof typeof EXPERIENCE_SALARY_BANDS | null>(null);
  const [advTypes, setAdvTypes] = useState<string[]>([]);
  const [advSalaryMin, setAdvSalaryMin] = useState<number>(1);
  const [advDate, setAdvDate] = useState<string>("Any time");
  const [advSkills, setAdvSkills] = useState<string[]>([]);
  const [advSkillInput, setAdvSkillInput] = useState<string>("");

  const [explorePage, setExplorePage] = useState<number>(1);

  useEffect(() => {
    setExplorePage(1);
  }, [
    exploreQuery,
    exploreCategory,
    exploreType,
    isAdvSearchApplied,
    advKeyword,
    advLocation,
    advExp,
    advTypes,
    advSalaryMin,
    advDate,
    advSkills
  ]);

  const resetFilters = () => {
    setExploreQuery("");
    setExploreCategory("All");
    setExploreType("All");
  };

  const openAdvancedSearch = () => setIsAdvSearchOpen(true);
  const closeAdvancedSearch = () => setIsAdvSearchOpen(false);

  const applyAdvancedSearch = () => {
    setIsAdvSearchOpen(false);
    setIsAdvSearchApplied(true);
  };

  const clearAdvancedSearch = () => {
    setIsAdvSearchApplied(false);
    setAdvKeyword("");
    setAdvLocation("");
    setAdvExp(null);
    setAdvTypes([]);
    setAdvSalaryMin(1);
    setAdvDate("Any time");
    setAdvSkills([]);
  };

  return {
    state: {
      exploreQuery,
      exploreCategory,
      exploreType,
      explorePage,
      isAdvSearchOpen,
      isAdvSearchApplied,
      advKeyword,
      advLocation,
      advExp,
      advTypes,
      advSalaryMin,
      advDate,
      advSkills,
      advSkillInput
    },
    actions: {
      setExploreQuery,
      setExploreCategory,
      setExploreType,
      setExplorePage,
      setAdvKeyword,
      setAdvLocation,
      setAdvExp,
      setAdvTypes,
      setAdvSalaryMin,
      setAdvDate,
      setAdvSkills,
      setAdvSkillInput,
      openAdvancedSearch,
      closeAdvancedSearch,
      applyAdvancedSearch,
      clearAdvancedSearch,
      resetFilters
    }
  };
}
