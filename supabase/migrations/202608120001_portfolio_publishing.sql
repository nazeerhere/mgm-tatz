create extension if not exists pgcrypto;

create type public.portfolio_item_type as enum ('tattoo', 'drawing', 'flash', 'concept');

create table public.owner_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.owner_users enable row level security;

create or replace function public.is_portfolio_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$ select exists (select 1 from public.owner_users where user_id = auth.uid()) $$;

revoke all on function public.is_portfolio_owner() from public;
grant execute on function public.is_portfolio_owner() to anon, authenticated;

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 100),
  type public.portfolio_item_type not null,
  description text not null check (char_length(description) between 10 and 800),
  body_placement text check (body_placement is null or char_length(body_placement) <= 100),
  featured boolean not null default false,
  available boolean not null default false,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_media (
  id uuid primary key default gen_random_uuid(),
  portfolio_item_id uuid not null references public.portfolio_items(id) on delete cascade,
  storage_bucket text not null check (storage_bucket in ('portfolio-drafts', 'portfolio-media')),
  storage_key text not null unique,
  alt_text text not null check (char_length(alt_text) between 5 and 180),
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  is_primary boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index one_primary_media_per_item on public.portfolio_media (portfolio_item_id) where is_primary;
create index published_portfolio_order on public.portfolio_items (display_order, created_at desc) where published;

create table public.style_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.portfolio_item_style_tags (
  portfolio_item_id uuid references public.portfolio_items(id) on delete cascade,
  style_tag_id uuid references public.style_tags(id) on delete cascade,
  primary key (portfolio_item_id, style_tag_id)
);

alter table public.portfolio_items enable row level security;
alter table public.portfolio_media enable row level security;
alter table public.style_tags enable row level security;
alter table public.portfolio_item_style_tags enable row level security;

create policy "published portfolio is publicly readable" on public.portfolio_items for select using (published or public.is_portfolio_owner());
create policy "published media metadata is publicly readable" on public.portfolio_media for select using (exists (select 1 from public.portfolio_items where id = portfolio_item_id and (published or public.is_portfolio_owner())));
create policy "owner manages portfolio" on public.portfolio_items for all to authenticated using (public.is_portfolio_owner()) with check (public.is_portfolio_owner());
create policy "owner manages media" on public.portfolio_media for all to authenticated using (public.is_portfolio_owner()) with check (public.is_portfolio_owner());
create policy "tags are publicly readable" on public.style_tags for select using (true);
create policy "owner manages tags" on public.style_tags for all to authenticated using (public.is_portfolio_owner()) with check (public.is_portfolio_owner());
create policy "published item tags are publicly readable" on public.portfolio_item_style_tags for select using (exists (select 1 from public.portfolio_items where id = portfolio_item_id and (published or public.is_portfolio_owner())));
create policy "owner manages item tags" on public.portfolio_item_style_tags for all to authenticated using (public.is_portfolio_owner()) with check (public.is_portfolio_owner());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-drafts', 'portfolio-drafts', false, 10485760, array['image/jpeg','image/png','image/webp']),
       ('portfolio-media', 'portfolio-media', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "owner manages draft objects" on storage.objects for all to authenticated using (bucket_id = 'portfolio-drafts' and public.is_portfolio_owner()) with check (bucket_id = 'portfolio-drafts' and public.is_portfolio_owner());
create policy "owner creates public objects" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media' and public.is_portfolio_owner());
create policy "owner updates public objects" on storage.objects for update to authenticated using (bucket_id = 'portfolio-media' and public.is_portfolio_owner()) with check (bucket_id = 'portfolio-media' and public.is_portfolio_owner());
create policy "owner deletes public objects" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media' and public.is_portfolio_owner());

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger portfolio_items_updated_at before update on public.portfolio_items for each row execute function public.set_updated_at();

insert into public.style_tags (name, slug) values
  ('Black & Grey', 'black-grey'), ('Illustrative', 'illustrative'), ('Anime / Manga', 'anime-manga'),
  ('Dark Fantasy', 'dark-fantasy'), ('Mythic', 'mythic'), ('Classical', 'classical'),
  ('Realism', 'realism'), ('Animals', 'animals'), ('Symbolic', 'symbolic')
on conflict (slug) do nothing;
