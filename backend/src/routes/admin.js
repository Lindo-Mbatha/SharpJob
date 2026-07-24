import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bulkImportJobs, createJob, updateJob } from "../db/repo.js";

const router = Router();

function validateCreatePayload(body) {
  const required = ["title", "company", "category", "location", "workModel", "employmentType", "closesAt", "description"];
  for (const key of required) {
    if (!body?.[key]) return `Missing required field: ${key}`;
  }
  return null;
}

router.post("/admin/jobs", asyncHandler(async (req, res) => {
  const error = validateCreatePayload(req.body);
  if (error) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: error, requestId: req.requestId } });
  }

  const item = await createJob(req.user.id, req.body);
  res.status(201).json({ item });
}));

router.patch("/admin/jobs/:jobId", asyncHandler(async (req, res) => {
  const item = await updateJob(req.params.jobId, req.body, req.user.id);
  if (!item) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Job not found", requestId: req.requestId } });
  }

  res.json({ item });
}));

router.post("/admin/jobs/:jobId/publish", asyncHandler(async (req, res) => {
  const item = await updateJob(req.params.jobId, { status: "published" }, req.user.id);
  if (!item) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Job not found", requestId: req.requestId } });
  }

  res.json({ item });
}));

router.post("/admin/jobs/:jobId/archive", asyncHandler(async (req, res) => {
  const item = await updateJob(req.params.jobId, { status: "archived" }, req.user.id);
  if (!item) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Job not found", requestId: req.requestId } });
  }

  res.json({ item });
}));

router.post("/admin/jobs/import", asyncHandler(async (req, res) => {
  const records = Array.isArray(req.body?.records) ? req.body.records : [];
  const result = await bulkImportJobs(req.user.id, records);
  res.json(result);
}));

export default router;
