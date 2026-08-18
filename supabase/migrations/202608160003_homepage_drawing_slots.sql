alter table public.portfolio_items
  add column if not exists drawing_featured boolean not null default false,
  add column if not exists homepage_drawing_order smallint;

with ranked_drawings as (
  select
    id,
    row_number() over (order by display_order asc, created_at desc) as slot
  from public.portfolio_items
  where published and type in ('drawing', 'flash', 'concept')
)
update public.portfolio_items as item
set drawing_featured = true,
    homepage_drawing_order = ranked.slot::smallint
from ranked_drawings as ranked
where item.id = ranked.id and ranked.slot <= 4;

alter table public.portfolio_items
  add constraint portfolio_homepage_drawing_placement_is_valid
  check (
    (
      drawing_featured
      and published
      and homepage_drawing_order between 1 and 4
    )
    or (
      not drawing_featured
      and homepage_drawing_order is null
    )
  );

create unique index portfolio_homepage_drawing_slot
  on public.portfolio_items (homepage_drawing_order)
  where drawing_featured;

create or replace function public.clear_homepage_drawing_before_unpublish()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not new.published then
    new.drawing_featured := false;
    new.homepage_drawing_order := null;
  end if;
  return new;
end;
$$;

create trigger clear_homepage_drawing_before_unpublish
  before update of published on public.portfolio_items
  for each row execute function public.clear_homepage_drawing_before_unpublish();

create or replace function public.set_homepage_drawing_placement(
  target_item_id uuid,
  target_drawing_order smallint
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.is_portfolio_owner() then
    raise exception 'Portfolio owner access required.';
  end if;

  if target_drawing_order is not null
     and target_drawing_order not between 1 and 4 then
    raise exception 'Homepage drawing slot must be between 1 and 4.';
  end if;

  if target_drawing_order is not null
     and not exists (
       select 1
       from public.portfolio_items
       where id = target_item_id and published
     ) then
    raise exception 'Only published work can be placed in the drawings section.';
  end if;

  if target_drawing_order is not null then
    update public.portfolio_items
    set drawing_featured = false,
        homepage_drawing_order = null
    where homepage_drawing_order = target_drawing_order
      and id <> target_item_id;
  end if;

  update public.portfolio_items
  set drawing_featured = target_drawing_order is not null,
      homepage_drawing_order = target_drawing_order
  where id = target_item_id;

  if not found then
    raise exception 'Portfolio item was not found.';
  end if;
end;
$$;

revoke all on function public.set_homepage_drawing_placement(uuid, smallint)
  from public, anon;
grant execute on function public.set_homepage_drawing_placement(uuid, smallint)
  to authenticated;
