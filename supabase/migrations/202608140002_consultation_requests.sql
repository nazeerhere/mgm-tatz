create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  location text not null check (char_length(location) between 2 and 120),
  tattoo_idea text not null check (char_length(tattoo_idea) between 20 and 2000),
  desired_placement text not null check (char_length(desired_placement) between 2 and 120),
  approximate_size text not null check (
    approximate_size in (
      'Small',
      'Palm-sized',
      'Forearm-sized',
      'Large / multi-session',
      'Not sure yet'
    )
  ),
  preferred_style text not null check (
    preferred_style in (
      'Black & grey',
      'Illustrative',
      'Anime / manga',
      'Dark fantasy',
      'Classical',
      'Animals / anatomy',
      'Open to artist direction'
    )
  ),
  color_preference text not null check (
    color_preference in ('Black & grey', 'Color', 'Open to either')
  ),
  project_type text not null check (
    project_type in ('New tattoo', 'Cover-up', 'Rework')
  ),
  artistic_interpretation text not null check (
    artistic_interpretation in (
      'Yes — bring your perspective',
      'Somewhat — I have a few must-keep details',
      'Not much — I have a specific direction'
    )
  ),
  preferred_timeframe text not null check (char_length(preferred_timeframe) between 2 and 100),
  avoid_notes text check (avoid_notes is null or char_length(avoid_notes) <= 1000),
  additional_notes text check (additional_notes is null or char_length(additional_notes) <= 1000),
  status text not null default 'new' check (status in ('new', 'reviewing', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consultation_request_media (
  id uuid primary key default gen_random_uuid(),
  consultation_request_id uuid not null references public.consultation_requests(id) on delete cascade,
  kind text not null check (kind in ('reference', 'body_area')),
  storage_bucket text not null check (storage_bucket = 'consultation-intake'),
  storage_key text not null unique,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  byte_size integer not null check (byte_size between 1 and 5242880),
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now()
);

create unique index one_body_area_image_per_consultation
  on public.consultation_request_media (consultation_request_id)
  where kind = 'body_area';

create index consultation_requests_review_order
  on public.consultation_requests (status, created_at desc);

alter table public.consultation_requests enable row level security;
alter table public.consultation_request_media enable row level security;

revoke all on table public.consultation_requests from anon;
revoke all on table public.consultation_request_media from anon;

create policy "owner reads consultation requests"
  on public.consultation_requests
  for select
  to authenticated
  using (public.is_portfolio_owner());

create policy "owner updates consultation requests"
  on public.consultation_requests
  for update
  to authenticated
  using (public.is_portfolio_owner())
  with check (public.is_portfolio_owner());

create policy "owner deletes consultation requests"
  on public.consultation_requests
  for delete
  to authenticated
  using (public.is_portfolio_owner());

create policy "owner reads consultation media"
  on public.consultation_request_media
  for select
  to authenticated
  using (public.is_portfolio_owner());

create policy "owner deletes consultation media metadata"
  on public.consultation_request_media
  for delete
  to authenticated
  using (public.is_portfolio_owner());

create trigger consultation_requests_updated_at
  before update on public.consultation_requests
  for each row execute function public.set_updated_at();

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'consultation-intake',
  'consultation-intake',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "owner manages consultation objects"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'consultation-intake'
    and public.is_portfolio_owner()
  )
  with check (
    bucket_id = 'consultation-intake'
    and public.is_portfolio_owner()
  );
