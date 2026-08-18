create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 5 and 200),
  answer text not null check (char_length(answer) between 5 and 2000),
  display_order integer not null default 0 check (display_order between 0 and 10000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index active_faq_display_order
  on public.faqs (display_order, created_at)
  where is_active;

alter table public.faqs enable row level security;

create policy "active FAQs are publicly readable"
  on public.faqs for select
  using (is_active or public.is_portfolio_owner());

create policy "owner manages FAQs"
  on public.faqs for all to authenticated
  using (public.is_portfolio_owner())
  with check (public.is_portfolio_owner());

revoke insert, update, delete on table public.faqs from anon;
grant select on table public.faqs to anon, authenticated;
grant insert, update, delete on table public.faqs to authenticated;

create trigger faqs_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

insert into public.faqs (question, answer, display_order, is_active)
values
  (
    'When will booking policies be available?',
    'Booking policies will be published after Miles supplies approved answers.',
    0,
    true
  ),
  (
    'How can I plan a piece?',
    'Consultation destination and studio contact details are forthcoming.',
    1,
    true
  );
