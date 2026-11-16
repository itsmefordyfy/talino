-- Talino AI's server tables, in the shared Fordytech Supabase project (the one CarMind, Pawfetti,
-- Ulamin and Bubblie use). Paste into the SQL Editor; safe to run again.
--
-- Only Talino's server routes (src/app/api/*, using SUPABASE_SECRET_KEY) read and write these:
-- row level security is on with no policies, so the public (anon/publishable) key can't touch them.
-- Tali's chat allowance uses the existing shared `ai_chats` table and functions
-- (CarMind's supabase/migrations/20261105000000_ai_chat_quota.sql) with app = 'talino',
-- 'talinoreview' and 'talinotailor'; nothing new is needed for it.

create table if not exists talino_certificates (
  id text primary key,
  app_user_id text not null,
  course_id text not null,
  course_title text not null,
  learner_name text not null,
  projects jsonb not null default '[]'::jsonb,
  issued_at timestamptz not null default now(),
  unique (app_user_id, course_id)
);

create table if not exists talino_portfolios (
  slug text primary key,
  token_hash text not null,
  data jsonb not null,
  talent boolean not null default false,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists talino_portfolios_talent on talino_portfolios (talent, updated_at desc);

-- Employers who may open /talent?key=… (key stored as its SHA-256 hex).
create table if not exists talino_employers (
  id bigint generated always as identity primary key,
  name text not null,
  key_hash text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Schools and companies: a class code grants its courses (RevenueCat promotional entitlements) for
-- seat_duration (monthly, three_month, six_month, yearly, lifetime) to up to `seats` learners.
create table if not exists talino_classes (
  code text primary key check (code ~ '^[A-Z0-9]{4,12}$'),
  name text not null,
  kind text not null default 'school' check (kind in ('school', 'company')),
  course_ids jsonb not null default '[]'::jsonb,
  seats integer not null default 40 check (seats > 0),
  seat_duration text not null default 'yearly',
  teacher_key_hash text not null,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists talino_class_members (
  code text not null references talino_classes (code) on delete cascade,
  app_user_id text not null,
  learner_name text not null,
  progress jsonb not null default '[]'::jsonb,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (code, app_user_id)
);

create table if not exists talino_referrals (
  code text primary key,
  app_user_id text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists talino_referral_redemptions (
  referee_app_user_id text primary key,
  code text not null references talino_referrals (code) on delete cascade,
  referrer_app_user_id text not null,
  rewarded boolean not null default false,
  rewarded_at timestamptz,
  created_at timestamptz not null default now()
);

alter table talino_certificates enable row level security;
alter table talino_portfolios enable row level security;
alter table talino_employers enable row level security;
alter table talino_classes enable row level security;
alter table talino_class_members enable row level security;
alter table talino_referrals enable row level security;
alter table talino_referral_redemptions enable row level security;

-- Example (run separately, with your own values): a class of 40 for the Developer course for a year.
--   insert into talino_classes (code, name, course_ids, seats, seat_duration, teacher_key_hash, expires_at)
--   values ('BSIT4A26', 'BSIT 4-A, Example University', '["developer"]', 40, 'yearly',
--           encode(sha256(convert_to('<a long random teacher key>', 'UTF8')), 'hex'), now() + interval '1 year');
-- Teacher link: https://<server>/teacher/BSIT4A26?key=<the same teacher key>
--
-- Example: an employer key.
--   insert into talino_employers (name, key_hash)
--   values ('Example Corp', encode(sha256(convert_to('<a long random employer key>', 'UTF8')), 'hex'));
-- Talent link: https://<server>/talent?key=<the same employer key>
