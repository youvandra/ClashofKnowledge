alter table if exists public.marketplace_listings
add column if not exists price integer not null default 0;

comment on column public.marketplace_listings.price is 'Price per rental unit or listing display';
