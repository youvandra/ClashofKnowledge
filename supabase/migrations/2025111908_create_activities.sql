create extension if not exists pgcrypto;

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  account_id text not null,
  type text not null default 'chat',
  question text,
  answer text,
  owned_ids text[] not null default '{}',
  listing_ids text[] not null default '{}',
  charges jsonb not null default '{}'::jsonb,
  total_amount integer not null default 0,
  transaction_ids text[] not null default '{}',
  network text,
  created_at timestamptz not null default now()
);

create index if not exists activities_account_idx on public.activities(account_id);
create index if not exists activities_created_at_idx on public.activities(created_at);

