import { Router } from "express";
import { getJobById, getJobFacets, listJobs } from "../db/repo.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/jobs", asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 10), 1), 50);
  const q = String(req.query.q || "").trim().toLowerCase();
  const category = String(req.query.category || "");
  const employmentType = String(req.query.employmentType || "");
  const workModel = String(req.query.workModel || "");
  const location = String(req.query.location || "").trim().toLowerCase();
  const status = String(req.query.status || "published");

  const result = await listJobs({
    userId: req.user.id,
    page,
    pageSize,
    filters: {
      q,
      category,
      employmentType,
      workModel,
      location,
      status
    }
  });

  const facets = await getJobFacets();

  res.json({
    items: result.items,
    pagination: result.pagination,
    facets: {
      categories: facets.categories,
      employmentTypes: facets.employmentTypes,
      workModels: facets.workModels
    }
  });
}));

router.get("/jobs/facets", asyncHandler(async (_req, res) => {
  const facets = await getJobFacets();
  res.json({
    categories: ["All", ...facets.categories.map((item) => item.value)],
    employmentTypes: ["All", ...facets.employmentTypes.map((item) => item.value)],
    workModels: facets.workModels.map((item) => item.value),
    postedWithinOptions: facets.postedWithinOptions
  });
}));

router.get("/jobs/:jobId", asyncHandler(async (req, res) => {
  const job = await getJobById(req.user.id, req.params.jobId);
  if (!job) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Job not found.",
        requestId: req.requestId
      }
    });
  }

  res.json({ item: job });
}));

export default router;
