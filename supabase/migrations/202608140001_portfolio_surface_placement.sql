alter table public.portfolio_items
  add column if not exists show_in_gallery boolean not null default true,
  add column if not exists homepage_order smallint;

with ranked_featured as (
  select
    id,
    row_number() over (order by display_order asc, created_at desc) as slot
  from public.portfolio_items
  where published and featured
)
update public.portfolio_items as item
set homepage_order = ranked.slot::smallint
from ranked_featured as ranked
where item.id = ranked.id and ranked.slot <= 4;

update public.portfolio_items
set featured = false,
    homepage_order = null
where featured and homepage_order is null;

alter table public.portfolio_items
  add constraint portfolio_homepage_placement_is_valid
  check (
    (featured and published and homepage_order between 1 and 4)
    or (not featured and homepage_order is null)
  );

create unique index portfolio_homepage_slot
  on public.portfolio_items (homepage_order)
  where featured;

create index published_gallery_order
  on public.portfolio_items (display_order, created_at desc)
  where published and show_in_gallery;

create or replace function public.set_portfolio_placement(
  target_item_id uuid,
  gallery_visible boolean,
  target_homepage_order smallint
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

  if gallery_visible is null then
    raise exception 'Gallery visibility is required.';
  end if;

  if target_homepage_order is not null
     and target_homepage_order not between 1 and 4 then
    raise exception 'Homepage slot must be between 1 and 4.';
  end if;

  if target_homepage_order is not null
     and not exists (
       select 1
       from public.portfolio_items
       where id = target_item_id and published
     ) then
    raise exception 'Only published work can be placed on the homepage.';
  end if;

  if target_homepage_order is not null then
    update public.portfolio_items
    set featured = false,
        homepage_order = null
    where homepage_order = target_homepage_order
      and id <> target_item_id;
  end if;

  update public.portfolio_items
  set show_in_gallery = gallery_visible,
      featured = target_homepage_order is not null,
      homepage_order = target_homepage_order
  where id = target_item_id;

  if not found then
    raise exception 'Portfolio item was not found.';
  end if;
end;
$$;

revoke all on function public.set_portfolio_placement(uuid, boolean, smallint) from public, anon;
grant execute on function public.set_portfolio_placement(uuid, boolean, smallint) to authenticated;
