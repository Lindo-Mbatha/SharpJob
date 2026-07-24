const now = new Date().toISOString();

export const store = {
  jobs: [
    {
      id: "job-1",
      title: "Product Designer",
      company: "Airbnb",
      category: "Design",
      location: "Cape Town, ZA",
      workModel: "Remote",
      employmentType: "Full-time",
      salaryMin: 95000,
      salaryMax: 125000,
      salaryCurrency: "ZAR",
      salaryPeriod: "year",
      closesAt: "2026-11-05T23:59:59Z",
      postedAt: now,
      description: "Design end-to-end product experiences.",
      responsibilities: ["Design flows", "Work with PM and Engineering"],
      requirements: ["4+ years experience", "Figma"],
      skills: ["Figma", "Design Systems", "Research"],
      companyBio: "Airbnb connects people to places.",
      status: "published",
      source: "employer_portal",
      updatedAt: now
    }
  ],
  savedJobsByUser: {
    "demo-user-1": new Set(["job-1"])
  },
  applicationsByUser: {
    "demo-user-1": {
      "job-1": {
        isApplied: false,
        appliedStatus: null,
        appliedAt: null,
        source: null
      }
    }
  },
  alertsByUser: {
    "demo-user-1": [
      {
        id: "alert-1",
        kind: "job_match",
        title: "New job match",
        message: "A Product Designer role matches your profile.",
        jobId: "job-1",
        read: false,
        createdAt: now
      }
    ]
  }
};

export function attachViewerState(userId, job) {
  const saved = store.savedJobsByUser[userId] || new Set();
  const appMap = store.applicationsByUser[userId] || {};
  const app = appMap[job.id] || { isApplied: false, appliedStatus: null, appliedAt: null };

  return {
    ...job,
    viewer: {
      isSaved: saved.has(job.id),
      isApplied: Boolean(app.isApplied),
      appliedStatus: app.appliedStatus,
      appliedAt: app.appliedAt
    }
  };
}
