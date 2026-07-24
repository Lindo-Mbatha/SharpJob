-- PostgreSQL schema for SharpJob API contract

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('candidate', 'employer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company_id uuid not null references companies(id) on delete cascade,
  category text not null,
  location text not null,
  work_model text not null check (work_model in ('Remote', 'Hybrid', 'Onsite')),
  employment_type text not null check (employment_type in ('Full-time', 'Part-time', 'Contract', 'Internship')),
  salary_min integer,
  salary_max integer,
  salary_currency text not null default 'ZAR',
  salary_period text not null default 'year',
  closes_at timestamptz not null,
  posted_at timestamptz not null default now(),
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  skills text[] not null default '{}',
  status text not null check (status in ('draft', 'published', 'archived', 'expired')) default 'draft',
  source text not null default 'employer_portal',
  created_by uuid references users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_jobs_status_posted_at on jobs(status, posted_at desc);
create index if not exists idx_jobs_category on jobs(category);
create index if not exists idx_jobs_work_model on jobs(work_model);
create index if not exists idx_jobs_employment_type on jobs(employment_type);
create index if not exists idx_jobs_closes_at on jobs(closes_at);

create table if not exists user_saved_jobs (
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

create table if not exists user_job_applications (
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  is_applied boolean not null default false,
  applied_status text,
  applied_at timestamptz,
  source text,
  updated_at timestamptz not null default now(),
  primary key (user_id, job_id),
  constraint chk_applied_status
    check (
      applied_status is null or
      applied_status in ('Submitted', 'Screening', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn')
    )
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  kind text not null,
  title text not null,
  message text not null,
  job_id uuid references jobs(id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_alerts_user_read_created on alerts(user_id, read, created_at desc);

create table if not exists job_import_batches (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references users(id) on delete set null,
  source text not null default 'csv',
  total integer not null default 0,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  failed_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists job_import_errors (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references job_import_batches(id) on delete cascade,
  row_number integer not null,
  field text,
  message text not null,
  created_at timestamptz not null default now()
);
