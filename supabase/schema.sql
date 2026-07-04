-- LoadMaster AI — Supabase database schema
-- Run this in Supabase Dashboard → SQL Editor → New query

-- 1. PROFILES TABLE
-- Extends Supabase's built-in auth.users with app-specific fields (plan).
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- SECURITY: prevent a logged-in user from upgrading their own plan by
-- calling the update API directly. Only the service role (used server-side
-- by the Click/Payme webhook handlers after a real payment is confirmed)
-- is allowed to change the `plan` column.
create or replace function public.protect_plan_column()
returns trigger as $$
begin
  if new.plan is distinct from old.plan and auth.role() <> 'service_role' then
    raise exception 'Only a confirmed payment can change your plan.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists protect_plan_column_trigger on public.profiles;
create trigger protect_plan_column_trigger
  before update on public.profiles
  for each row execute procedure public.protect_plan_column();

-- Automatically create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. GENERATIONS TABLE
-- Stores every AI-generated content result per user.
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  niche text not null,
  caption text not null,
  hashtags text[] not null,
  slogan text not null,
  script jsonb not null,
  video_prompt text not null,
  source text not null default 'template',
  created_at timestamptz not null default now()
);

alter table public.generations enable row level security;

create policy "Users can view their own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own generations"
  on public.generations for delete
  using (auth.uid() = user_id);

create index if not exists generations_user_id_created_at_idx
  on public.generations (user_id, created_at desc);


-- 3. DAILY USAGE TABLE
-- Tracks how many generations a free user has used today.
create table if not exists public.daily_usage (
  user_id uuid references auth.users(id) on delete cascade not null,
  usage_date date not null default current_date,
  count int not null default 0,
  primary key (user_id, usage_date)
);

alter table public.daily_usage enable row level security;

create policy "Users can view their own usage"
  on public.daily_usage for select
  using (auth.uid() = user_id);

-- Usage rows are written via the service role from the server (API route),
-- not directly by the client, so no insert/update policy is needed here.

-- Atomically increments (or creates) today's usage row for the CURRENT
-- authenticated user. Uses auth.uid() internally (not a passed-in id) so a
-- user can never increment another user's usage count.
create or replace function public.increment_daily_usage()
returns int as $$
declare
  new_count int;
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.daily_usage (user_id, usage_date, count)
  values (uid, current_date, 1)
  on conflict (user_id, usage_date)
  do update set count = public.daily_usage.count + 1
  returning count into new_count;

  return new_count;
end;
$$ language plpgsql security definer;


-- 4. PAYMENTS TABLE
-- Records Click/Payme transactions for auditing and plan upgrades.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null check (provider in ('click', 'payme')),
  provider_transaction_id text not null,
  amount numeric not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'failed')),
  -- Payme-specific fields (unused by Click, left null there)
  payme_state int,
  payme_create_time bigint,
  payme_perform_time bigint,
  payme_cancel_time bigint,
  payme_cancel_reason int,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  unique (provider, provider_transaction_id)
);

alter table public.payments enable row level security;

create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- Payments are written by the server (service role) only, from the
-- Click/Payme webhook handlers — no client insert/update policy needed.
