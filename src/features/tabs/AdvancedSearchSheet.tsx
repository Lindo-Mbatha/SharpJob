import React from "react";
import { Info, MapPin, Search, X } from "lucide-react";
import { EXPERIENCE_SALARY_BANDS } from "../listings/constants";

export function AdvancedSearchSheet({
  darkMode,
  activeAccentPrimary,
  activeAccentText,
  isAdvSearchApplied,
  advKeyword,
  advLocation,
  advExp,
  advTypes,
  advSalaryMin,
  advDate,
  advSkills,
  advSkillInput,
  setAdvKeyword,
  setAdvLocation,
  setAdvExp,
  setAdvTypes,
  setAdvSalaryMin,
  setAdvDate,
  setAdvSkills,
  setAdvSkillInput,
  onClose,
  onSearch,
  onClear
}: {
  darkMode: boolean;
  activeAccentPrimary: string;
  activeAccentText: string;
  isAdvSearchApplied: boolean;
  advKeyword: string;
  advLocation: string;
  advExp: keyof typeof EXPERIENCE_SALARY_BANDS | null;
  advTypes: string[];
  advSalaryMin: number;
  advDate: string;
  advSkills: string[];
  advSkillInput: string;
  setAdvKeyword: React.Dispatch<React.SetStateAction<string>>;
  setAdvLocation: React.Dispatch<React.SetStateAction<string>>;
  setAdvExp: React.Dispatch<React.SetStateAction<keyof typeof EXPERIENCE_SALARY_BANDS | null>>;
  setAdvTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setAdvSalaryMin: React.Dispatch<React.SetStateAction<number>>;
  setAdvDate: React.Dispatch<React.SetStateAction<string>>;
  setAdvSkills: React.Dispatch<React.SetStateAction<string[]>>;
  setAdvSkillInput: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSearch: () => void;
  onClear: () => void;
}) {
  const activeExperienceBand = advExp ? EXPERIENCE_SALARY_BANDS[advExp] : null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className={`absolute bottom-0 left-0 right-0 max-h-[85%] rounded-t-3xl flex flex-col animate-slide-up shadow-2xl ${
        darkMode ? "bg-slate-950 border-t border-slate-800" : "bg-white border-t border-slate-200"
      }`}>
        <div className={`flex items-center justify-between p-4 border-b shrink-0 ${
          darkMode ? "border-slate-850" : "border-slate-100"
        }`}>
          <div>
            <h3 className={`text-base font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>Advanced search</h3>
            <p className="text-[11px] text-slate-500">Narrow down your next role.</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${darkMode ? "bg-slate-900 text-slate-400 hover:text-slate-200" : "bg-slate-100 text-slate-500 hover:text-slate-700"}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Job title or keyword</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={advKeyword}
                onChange={e => setAdvKeyword(e.target.value)}
                placeholder="e.g. Product designer"
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={advLocation}
                onChange={e => setAdvLocation(e.target.value)}
                placeholder="City, state, or remote"
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Job type</label>
            <div className="flex flex-wrap gap-2">
              {["Full-time", "Contract", "Remote", "Hybrid"].map(type => {
                const isActive = advTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => setAdvTypes(prev => isActive ? prev.filter(t => t !== type) : [...prev, type])}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                      isActive
                        ? `${activeAccentPrimary} text-white border-transparent`
                        : darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary range (minimum)</label>
              <span className={`text-[11px] font-bold ${activeAccentText}`}>
                R{advSalaryMin}k - R750K+
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="750"
              step="1"
              value={advSalaryMin}
              onChange={(e) => setAdvSalaryMin(Number(e.target.value))}
              className={`w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer outline-none ${activeAccentText}`}
              style={{ accentColor: "currentColor" }}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Date posted</label>
            <select
              value={advDate}
              onChange={e => setAdvDate(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 appearance-none ${
                darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"
              }`}
            >
              <option>Any time</option>
              <option>Past 24 hours</option>
              <option>Past week</option>
              <option>Past month</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Skills or qualifications</label>
            <div className="space-y-2">
              {advSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {advSkills.map(skill => (
                    <span key={skill} className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${
                      darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}>
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer opacity-50 hover:opacity-100"
                        onClick={() => setAdvSkills(prev => prev.filter(s => s !== skill))}
                      />
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={advSkillInput}
                onChange={e => setAdvSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && advSkillInput.trim()) {
                    e.preventDefault();
                    if (!advSkills.includes(advSkillInput.trim())) setAdvSkills([...advSkills, advSkillInput.trim()]);
                    setAdvSkillInput("");
                  }
                }}
                placeholder="e.g. Figma, SQL (Press Enter)"
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-slate-700" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300"
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience level</label>
              <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">Salary-band search</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(EXPERIENCE_SALARY_BANDS) as Array<keyof typeof EXPERIENCE_SALARY_BANDS>).map(level => (
                <button
                  key={level}
                  onClick={() => setAdvExp(level)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                    advExp === level
                      ? `${activeAccentPrimary} text-white border-transparent`
                      : darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {activeExperienceBand && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
                <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p>
                  <strong>{advExp} overrides every other filter.</strong> Results will only show roles with starting salaries in the {activeExperienceBand.max === Number.POSITIVE_INFINITY ? `R${(activeExperienceBand.min * 1000).toLocaleString()}+` : `R${(activeExperienceBand.min * 1000).toLocaleString()} – R${(activeExperienceBand.max * 1000).toLocaleString()}`} compensation band.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={`p-4 border-t shrink-0 ${
          darkMode ? "bg-slate-950 border-slate-850" : "bg-white border-slate-100"
        }`}>
          <button
            onClick={onSearch}
            className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 ${activeAccentPrimary}`}
          >
            Search jobs
          </button>
          {isAdvSearchApplied && (
            <button
              onClick={onClear}
              className="w-full mt-2 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear advanced filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
