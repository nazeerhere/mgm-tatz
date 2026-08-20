import { hasSupabaseEnvironment } from "@/lib/env";
import { GALLERY_PAGE_SIZE, type GalleryFilters } from "@/lib/gallery-filters";
import type { PublishedPortfolioItem } from "@/lib/portfolio";
import { createClient } from "@/lib/supabase/server";

const portfolioSelect =
  "id,title,type,description,body_placement,featured,show_in_gallery,homepage_order,available,display_order,created_at,portfolio_media!inner(storage_bucket,storage_key,alt_text,width,height),portfolio_item_style_tags(style_tags(slug))";
const legacyPortfolioSelect =
  "id,title,type,description,body_placement,featured,available,display_order,created_at,portfolio_media!inner(storage_bucket,storage_key,alt_text,width,height),portfolio_item_style_tags(style_tags(slug))";

function gallerySelect(style: GalleryFilters["style"], legacy = false) {
  const base = legacy
    ? "id,title,type,description,body_placement,featured,available,display_order,created_at"
    : "id,title,type,description,body_placement,featured,show_in_gallery,homepage_order,available,display_order,created_at";
  const styles =
    style === "all"
      ? "portfolio_item_style_tags(style_tags(slug))"
      : "portfolio_item_style_tags!inner(style_tags!inner(slug))";
  return `${base},portfolio_media!inner(storage_bucket,storage_key,alt_text,width,height),${styles}`;
}

export type HomepageDrawingItem = {
  id: string;
  title: string;
  displayOrder: number;
  media: {
    storage_bucket: string;
    storage_key: string;
    alt_text: string;
    width: number | null;
    height: number | null;
  };
};

function placementSchemaIsPending(error: { code?: string; message?: string }) {
  return (
    error.code === "42703" ||
    error.message?.includes("show_in_gallery") ||
    error.message?.includes("homepage_order")
  );
}

export async function getPublishedPortfolioPage(
  filters: GalleryFilters,
  page: number,
) {
  if (!hasSupabaseEnvironment())
    return {
      items: [] as PublishedPortfolioItem[],
      count: 0,
      totalPages: 1,
      currentPage: 1,
      configured: false,
    };

  const supabase = await createClient();

  function buildQuery(
    select: string,
    includeGallery: boolean,
    countOnly = false,
  ) {
    let query = countOnly
      ? supabase
          .from("portfolio_items")
          .select(select, { count: "exact", head: true })
      : supabase.from("portfolio_items").select(select);
    query = query.eq("published", true).eq("portfolio_media.is_primary", true);
    if (includeGallery) query = query.eq("show_in_gallery", true);
    if (filters.type === "tattoo") query = query.eq("type", "tattoo");
    if (filters.type === "drawing")
      query = query.in("type", ["drawing", "flash", "concept"]);
    if (filters.style !== "all")
      query = query.eq(
        "portfolio_item_style_tags.style_tags.slug",
        filters.style,
      );
    if (filters.sort === "featured") {
      query = query
        .order("featured", { ascending: false })
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
    } else {
      query = query
        .order("created_at", { ascending: false })
        .order("display_order", { ascending: true });
    }
    return query;
  }

  let { error, count } = await buildQuery(
    gallerySelect(filters.style),
    true,
    true,
  );
  let legacy = false;
  if (error && placementSchemaIsPending(error)) {
    legacy = true;
    ({ error, count } = await buildQuery(
      gallerySelect(filters.style, true),
      false,
      true,
    ));
  }
  if (error) throw new Error("Published work is temporarily unavailable.");

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / GALLERY_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * GALLERY_PAGE_SIZE;
  const { data, error: pageError } = await buildQuery(
    gallerySelect(filters.style, legacy),
    !legacy,
  ).range(offset, offset + GALLERY_PAGE_SIZE - 1);
  if (pageError) throw new Error("Published work is temporarily unavailable.");
  const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
  const items = legacy
    ? rows.map((item) => ({
        ...item,
        show_in_gallery: true,
        homepage_order: null,
      }))
    : rows;
  return {
    items: items as PublishedPortfolioItem[],
    count: total,
    totalPages,
    currentPage,
    configured: true,
  };
}

export async function getHomepagePortfolioItems() {
  if (!hasSupabaseEnvironment())
    return { items: [] as PublishedPortfolioItem[], configured: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(portfolioSelect)
    .eq("published", true)
    .eq("featured", true)
    .eq("portfolio_media.is_primary", true)
    .order("homepage_order", { ascending: true })
    .limit(4);
  if (error && placementSchemaIsPending(error)) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("portfolio_items")
      .select(legacyPortfolioSelect)
      .eq("published", true)
      .eq("featured", true)
      .eq("portfolio_media.is_primary", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(4);
    if (legacyError)
      throw new Error("Featured work is temporarily unavailable.");
    return {
      items: (legacyData ?? []).map((item, index) => ({
        ...item,
        show_in_gallery: true,
        homepage_order: index + 1,
      })) as PublishedPortfolioItem[],
      configured: true,
    };
  }
  if (error) throw new Error("Featured work is temporarily unavailable.");
  return { items: (data ?? []) as PublishedPortfolioItem[], configured: true };
}

export async function getHomepageDrawingItems() {
  if (!hasSupabaseEnvironment())
    return { items: [] as HomepageDrawingItem[], configured: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      "id,title,drawing_featured,homepage_drawing_order,portfolio_media!inner(storage_bucket,storage_key,alt_text,width,height,is_primary)",
    )
    .eq("published", true)
    .eq("drawing_featured", true)
    .eq("portfolio_media.is_primary", true)
    .order("homepage_drawing_order", { ascending: true })
    .limit(4);

  if (error) return { items: [] as HomepageDrawingItem[], configured: false };

  const items = (data ?? []).flatMap((item) => {
    const media = item.portfolio_media?.[0];
    if (!media || item.homepage_drawing_order === null) return [];
    return [
      {
        id: item.id,
        title: item.title,
        displayOrder: item.homepage_drawing_order,
        media,
      },
    ];
  });
  return { items: items as HomepageDrawingItem[], configured: true };
}
