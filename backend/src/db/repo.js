import { query } from "./client.js";

export const DEFAULT_CANDIDATE_EMAIL_DOMAIN = "local.sharpjob";

export async function ensureUser(userId, role = "candidate") {
  const email = `${userId}@${DEFAULT_CANDIDATE_EMAIL_DOMAIN}`;
  await query(
    `insert into users (id, email, role)
     values ($1::uuid, $2, $3)
     on conflict (id) do update set role = excluded.role`,
    [userId, email, role]
  );
}

function mapJobRow(row) {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    category: row.category,
    location: row.location,
    workModel: row.workmodel,
    employmentType: row.employmenttype,
    salaryMin: row.salarymin,
    salaryMax: row.salarymax,
    salaryCurrency: row.salarycurrency,
    salaryPeriod: row.salaryperiod,
    closesAt: row.closesat,
    postedAt: row.postedat,
    description: row.description,
    responsibilities: row.responsibilities || [],
    requirements: row.requirements || [],
    skills: row.skills || [],
    companyBio: row.companybio || "",
    status: row.status,
    source: row.source,
    updatedAt: row.updatedat,
    viewer: {
      isSaved: Boolean(row.issaved),
      isApplied: Boolean(row.isapplied),
      appliedStatus: row.appliedstatus,
      appliedAt: row.appliedat
    }
  };
}

function buildJobsWhere(filters, args) {
  const clauses = [];
  if (filters.status) {
    args.push(filters.status);
    clauses.push(`j.status = $${args.length}`);
  }
  if (filters.category && filters.category !== "All") {
    args.push(filters.category);
    clauses.push(`j.category = $${args.length}`);
  }
  if (filters.employmentType && filters.employmentType !== "All") {
    args.push(filters.employmentType);
    clauses.push(`j.employment_type = $${args.length}`);
  }
  if (filters.workModel) {
    args.push(filters.workModel);
    clauses.push(`j.work_model = $${args.length}`);
  }
  if (filters.location) {
    args.push(`%${filters.location.toLowerCase()}%`);
    clauses.push(`lower(j.location) like $${args.length}`);
  }
  if (filters.q) {
    args.push(`%${filters.q.toLowerCase()}%`);
    clauses.push(`lower(j.title || ' ' || c.name || ' ' || j.location) like $${args.length}`);
  }
  return clauses.length ? `where ${clauses.join(" and ")}` : "";
}

export async function listJobs({ userId, page, pageSize, filters }) {
  const args = [userId];
  const whereSql = buildJobsWhere(filters, args);

  const countResult = await query(
    `select count(*)::int as total
     from jobs j
     join companies c on c.id = j.company_id
     ${whereSql}`,
    args
  );

  const totalItems = countResult.rows[0]?.total || 0;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = (safePage - 1) * pageSize;

  args.push(pageSize);
  args.push(offset);

  const rows = await query(
    `select
        j.id::text as id,
        j.title,
        c.name as company,
        j.category,
        j.location,
        j.work_model as workModel,
        j.employment_type as employmentType,
        j.salary_min as salaryMin,
        j.salary_max as salaryMax,
        j.salary_currency as salaryCurrency,
        j.salary_period as salaryPeriod,
        j.closes_at as closesAt,
        j.posted_at as postedAt,
        j.description,
        j.responsibilities,
        j.requirements,
        j.skills,
        c.bio as companyBio,
        j.status,
        j.source,
        j.updated_at as updatedAt,
        (usj.job_id is not null) as isSaved,
        coalesce(uja.is_applied, false) as isApplied,
        uja.applied_status as appliedStatus,
        uja.applied_at as appliedAt
      from jobs j
      join companies c on c.id = j.company_id
      left join user_saved_jobs usj on usj.job_id = j.id and usj.user_id = $1::uuid
      left join user_job_applications uja on uja.job_id = j.id and uja.user_id = $1::uuid
      ${whereSql}
      order by j.posted_at desc
      limit $${args.length - 1}
      offset $${args.length}`,
    args
  );

  return {
    items: rows.rows.map(mapJobRow),
    pagination: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages
    }
  };
}

export async function getJobById(userId, jobId) {
  const result = await query(
    `select
        j.id::text as id,
        j.title,
        c.name as company,
        j.category,
        j.location,
        j.work_model as workModel,
        j.employment_type as employmentType,
        j.salary_min as salaryMin,
        j.salary_max as salaryMax,
        j.salary_currency as salaryCurrency,
        j.salary_period as salaryPeriod,
        j.closes_at as closesAt,
        j.posted_at as postedAt,
        j.description,
        j.responsibilities,
        j.requirements,
        j.skills,
        c.bio as companyBio,
        j.status,
        j.source,
        j.updated_at as updatedAt,
        (usj.job_id is not null) as isSaved,
        coalesce(uja.is_applied, false) as isApplied,
        uja.applied_status as appliedStatus,
        uja.applied_at as appliedAt
      from jobs j
      join companies c on c.id = j.company_id
      left join user_saved_jobs usj on usj.job_id = j.id and usj.user_id = $1::uuid
      left join user_job_applications uja on uja.job_id = j.id and uja.user_id = $1::uuid
      where j.id::text = $2
      limit 1`,
    [userId, jobId]
  );

  if (result.rowCount === 0) return null;
  return mapJobRow(result.rows[0]);
}

export async function getJobFacets() {
  const categories = await query(`select category as value, count(*)::int as count from jobs where status = 'published' group by category order by category asc`);
  const employmentTypes = await query(`select employment_type as value, count(*)::int as count from jobs where status = 'published' group by employment_type order by employment_type asc`);
  const workModels = await query(`select work_model as value, count(*)::int as count from jobs where status = 'published' group by work_model order by work_model asc`);

  return {
    categories: categories.rows,
    employmentTypes: employmentTypes.rows,
    workModels: workModels.rows,
    postedWithinOptions: ["Any time", "Past 24 hours", "Past week", "Past month"]
  };
}

export async function getSavedJobs(userId) {
  const result = await query(
    `select j.id::text as id
     from user_saved_jobs usj
     join jobs j on j.id = usj.job_id
     where usj.user_id = $1::uuid
     order by usj.saved_at desc`,
    [userId]
  );

  const items = [];
  for (const row of result.rows) {
    const item = await getJobById(userId, row.id);
    if (item) items.push(item);
  }

  return items;
}

export async function setSavedJob(userId, jobId, saved) {
  const idResult = await query(`select id from jobs where id::text = $1`, [jobId]);
  if (idResult.rowCount === 0) return null;
  const jobUuid = idResult.rows[0].id;

  if (saved) {
    await query(
      `insert into user_saved_jobs (user_id, job_id)
       values ($1::uuid, $2::uuid)
       on conflict (user_id, job_id) do nothing`,
      [userId, jobUuid]
    );
  } else {
    await query(`delete from user_saved_jobs where user_id = $1::uuid and job_id = $2::uuid`, [userId, jobUuid]);
  }

  return {
    jobId,
    saved,
    savedAt: saved ? new Date().toISOString() : null
  };
}

export async function setApplicationStatus(userId, jobId, payload) {
  const idResult = await query(`select id from jobs where id::text = $1`, [jobId]);
  if (idResult.rowCount === 0) return null;
  const jobUuid = idResult.rows[0].id;

  await query(
    `insert into user_job_applications (user_id, job_id, is_applied, applied_status, applied_at, source)
     values ($1::uuid, $2::uuid, $3, $4, $5, $6)
     on conflict (user_id, job_id)
     do update set
       is_applied = excluded.is_applied,
       applied_status = excluded.applied_status,
       applied_at = excluded.applied_at,
       source = excluded.source,
       updated_at = now()`,
    [userId, jobUuid, payload.isApplied, payload.appliedStatus, payload.appliedAt, payload.source]
  );

  return {
    jobId,
    isApplied: payload.isApplied,
    appliedStatus: payload.appliedStatus,
    appliedAt: payload.appliedAt
  };
}

export async function getAlerts(userId, filter) {
  const where = filter === "unread" ? "and a.read = false" : "";
  const itemsResult = await query(
    `select a.id::text as id, a.kind, a.title, a.message, a.job_id::text as jobId, a.read, a.created_at as createdAt
     from alerts a
     where a.user_id = $1::uuid ${where}
     order by a.created_at desc`,
    [userId]
  );

  const unreadCountResult = await query(
    `select count(*)::int as unread_count from alerts where user_id = $1::uuid and read = false`,
    [userId]
  );

  return {
    items: itemsResult.rows,
    unreadCount: unreadCountResult.rows[0]?.unread_count || 0
  };
}

export async function setAlertRead(userId, alertId, read) {
  const result = await query(
    `update alerts
     set read = $3
     where user_id = $1::uuid and id::text = $2
     returning id::text as id, read`,
    [userId, alertId, Boolean(read)]
  );

  if (result.rowCount === 0) return null;
  return result.rows[0];
}

async function upsertCompany(name, bio = "") {
  const result = await query(
    `insert into companies (name, bio)
     values ($1, $2)
     on conflict (name)
     do update set bio = excluded.bio
     returning id`,
    [name, bio]
  );
  return result.rows[0].id;
}

export async function createJob(createdBy, data) {
  const companyId = await upsertCompany(data.company, data.companyBio || "");

  const result = await query(
    `insert into jobs (
      title, company_id, category, location, work_model, employment_type,
      salary_min, salary_max, salary_currency, salary_period, closes_at,
      description, responsibilities, requirements, skills, status, source, created_by
    ) values (
      $1, $2::uuid, $3, $4, $5, $6,
      $7, $8, $9, $10, $11::timestamptz,
      $12, $13::text[], $14::text[], $15::text[], $16, $17, $18::uuid
    ) returning id::text as id`,
    [
      data.title,
      companyId,
      data.category,
      data.location,
      data.workModel,
      data.employmentType,
      data.salaryMin || null,
      data.salaryMax || null,
      data.salaryCurrency || "ZAR",
      data.salaryPeriod || "year",
      data.closesAt,
      data.description,
      data.responsibilities || [],
      data.requirements || [],
      data.skills || [],
      data.status || "draft",
      data.source || "employer_portal",
      createdBy
    ]
  );

  return getJobById(createdBy, result.rows[0].id);
}

export async function updateJob(jobId, patch, updatedBy) {
  const existing = await query(`select id::text as id from jobs where id::text = $1`, [jobId]);
  if (existing.rowCount === 0) return null;

  if (patch.company || patch.companyBio) {
    const previous = await query(
      `select c.name, c.bio from jobs j join companies c on c.id = j.company_id where j.id::text = $1`,
      [jobId]
    );
    const nextName = patch.company || previous.rows[0].name;
    const nextBio = patch.companyBio ?? previous.rows[0].bio;
    const companyId = await upsertCompany(nextName, nextBio);
    patch.companyId = companyId;
  }

  const fields = [];
  const values = [];
  const map = {
    title: "title",
    category: "category",
    location: "location",
    workModel: "work_model",
    employmentType: "employment_type",
    salaryMin: "salary_min",
    salaryMax: "salary_max",
    salaryCurrency: "salary_currency",
    salaryPeriod: "salary_period",
    closesAt: "closes_at",
    description: "description",
    responsibilities: "responsibilities",
    requirements: "requirements",
    skills: "skills",
    status: "status",
    source: "source",
    companyId: "company_id"
  };

  for (const [key, column] of Object.entries(map)) {
    if (patch[key] !== undefined) {
      values.push(patch[key]);
      if (["responsibilities", "requirements", "skills"].includes(key)) {
        fields.push(`${column} = $${values.length}::text[]`);
      } else if (key === "closesAt") {
        fields.push(`${column} = $${values.length}::timestamptz`);
      } else if (key === "companyId") {
        fields.push(`${column} = $${values.length}::uuid`);
      } else {
        fields.push(`${column} = $${values.length}`);
      }
    }
  }

  if (fields.length === 0) {
    return getJobById(updatedBy, jobId);
  }

  values.push(jobId);
  await query(`update jobs set ${fields.join(", ")}, updated_at = now() where id::text = $${values.length}`, values);

  return getJobById(updatedBy, jobId);
}

export async function bulkImportJobs(uploadedBy, records) {
  let created = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < records.length; i += 1) {
    const row = records[i];
    const required = ["title", "company", "category", "location", "workModel", "employmentType", "closesAt", "description"];
    const missing = required.find((k) => !row?.[k]);
    if (missing) {
      failed += 1;
      errors.push({ row: i + 1, field: missing, message: `Missing required field: ${missing}` });
      continue;
    }

    try {
      await createJob(uploadedBy, { ...row, source: "csv_import" });
      created += 1;
    } catch (error) {
      failed += 1;
      errors.push({ row: i + 1, field: "record", message: error instanceof Error ? error.message : "Import failed" });
    }
  }

  return {
    total: records.length,
    created,
    updated: 0,
    failed,
    errors
  };
}
