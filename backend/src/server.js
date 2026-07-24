import cors from "cors";
import express from "express";
import { requireAuth, requireRole } from "./middleware/auth.js";
import jobsRoutes from "./routes/jobs.js";
import meRoutes from "./routes/me.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const basePath = process.env.API_BASE_PATH || "/v1";

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  req.requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "sharpjob-api" });
});

app.use(basePath, requireAuth, jobsRoutes);
app.use(basePath, requireAuth, meRoutes);
app.use(basePath, requireAuth, requireRole("admin", "employer"), adminRoutes);

app.use((error, req, res, _next) => {
  console.error("[api:error]", error);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
      requestId: req.requestId
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
      requestId: req.requestId
    }
  });
});

app.listen(port, () => {
  console.log(`SharpJob API listening on http://localhost:${port}${basePath}`);
});
