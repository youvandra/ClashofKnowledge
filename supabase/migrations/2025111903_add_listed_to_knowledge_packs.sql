alter table public.knowledge_packs
  add column if not exists listed boolean not null default false;

create unique index if not exists marketplace_listings_unique_kp
  on public.marketplace_listings(knowledge_pack_id);

