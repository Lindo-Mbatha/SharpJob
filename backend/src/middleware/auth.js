import { ensureUser } from "../db/repo.js";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";
const UUID_V4ISH = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeUserId(value) {
  if (!value) return DEFAULT_USER_ID;
  const trimmed = String(value).trim();
  return UUID_V4ISH.test(trimmed) ? trimmed : DEFAULT_USER_ID;
}

export function requireAuth(req, res, next) {
  const userId = normalizeUserId(req.header("x-user-id"));
  const role = req.header("x-user-role") || "candidate";

  ensureUser(userId, role)
    .then(() => {
      req.user = { id: userId, role };
      next();
    })
    .catch(next);
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
          requestId: req.requestId
        }
      });
    }
    next();
  };
}
