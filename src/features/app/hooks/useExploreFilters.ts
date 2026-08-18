import { useEffect, useState } from "react";
import { EXPERIENCE_SALARY_BANDS } from "../../listings/constants";
import { readStoredValue, writeStoredValue } from "./useProfileSettings";

const RECENT_SEARCHES_KEY = "sharpjob.explore.recentSearches.v1";
const MAX_RECENT_SEARCHES = 6;

export function useExploreFilters() {
  const [exploreQuery, setExploreQuery] = useState<string>("");
  const [exploreCategory, setExploreCategory] = useState<string>("All");
  const [exploreType, setExploreType] = useState<string>("All");

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await readStoredValue(RECENT_SEARCHES_KEY);
      if (cancelled) return;

      if (!stored) return;
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((term): term is string => typeof term === "string").slice(0, MAX_RECENT_SEARCHES));
        }
      } catch {
        // Ignore corrupt payload and keep empty defaults.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const persistRecentSearches = (next: string[]) => {
    setRecentSearches(next);
    void writeStoredValue(RECENT_SEARCHES_KEY, JSON.stringify(next));
  };

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecentSearches(current => {
      const deduped = current.filter(term => term.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...deduped].slice(0, MAX_RECENT_SEARCHES);
      void writeStoredValue(RECENT_SEARCHES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeRecentSearch = (query: string) => {
    persistRecentSearches(recentSearches.filter(term => term !== query));
  };

  const clearRecentSearches = () => {
    persistRecentSearches([]);
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
      advSkillInput,
      recentSearches
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
      addRecentSearch,
      removeRecentSearch,
      clearRecentSearches,
      openAdvancedSearch,
      closeAdvancedSearch,
      applyAdvancedSearch,
      clearAdvancedSearch,
      resetFilters
    }
  };
}
