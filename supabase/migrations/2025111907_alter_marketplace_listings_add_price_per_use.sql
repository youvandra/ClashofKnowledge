alter table if exists public.marketplace_listings
add column if not exists price_per_use integer not null default 0;

comment on column public.marketplace_listings.price_per_use is 'Price per single use in playground';
