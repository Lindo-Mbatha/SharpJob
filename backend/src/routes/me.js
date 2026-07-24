import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAlerts, getSavedJobs, setAlertRead, setApplicationStatus, setSavedJob } from "../db/repo.js";

const router = Router();

router.get("/me/jobs/saved", asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const items = await getSavedJobs(userId);

  res.json({
    items,
    pagination: {
      page: 1,
      pageSize: items.length,
      totalItems: items.length,
      totalPages: 1
    }
  });
}));

router.put("/me/jobs/:jobId/saved", asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { saved } = req.body || {};

  if (saved !== true && saved !== false) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "saved must be a boolean",
        requestId: req.requestId
      }
    });
  }

  const result = await setSavedJob(userId, req.params.jobId, saved);
  if (!result) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Job not found",
        requestId: req.requestId
      }
    });
  }

  res.json(result);
}));

router.delete("/me/jobs/:jobId/saved", asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await setSavedJob(userId, req.params.jobId, false);
  if (!result) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Job not found",
        requestId: req.requestId
      }
    });
  }

  res.json({ jobId: req.params.jobId, saved: false });
}));

router.put("/me/jobs/:jobId/application-status", asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { isApplied, appliedStatus = null, appliedAt = null, source = null } = req.body || {};

  if (typeof isApplied !== "boolean") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "isApplied must be a boolean",
        requestId: req.requestId
      }
    });
  }

  const result = await setApplicationStatus(userId, req.params.jobId, {
    isApplied,
    appliedStatus,
    appliedAt: appliedAt || null,
    source: source || null
  });

  if (!result) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Job not found",
        requestId: req.requestId
      }
    });
  }

  res.json(result);
}));

router.get("/me/alerts", asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const filter = String(req.query.filter || "all");
  const result = await getAlerts(userId, filter);

  res.json({
    items: result.items,
    unreadCount: result.unreadCount,
    pagination: {
      page: 1,
      pageSize: result.items.length,
      totalItems: result.items.length,
      totalPages: 1
    }
  });
}));

router.put("/me/alerts/:alertId/read", asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { read } = req.body || {};
  const target = await setAlertRead(userId, req.params.alertId, read);

  if (!target) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Alert not found",
        requestId: req.requestId
      }
    });
  }

  res.json({ id: target.id, read: target.read });
}));

export default router;
