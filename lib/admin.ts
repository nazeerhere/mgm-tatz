import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnvironment } from "@/lib/env";
import { publicMediaUrl } from "@/lib/portfolio";

export type AdminPortfolioItem = {
  id: string;
  title: string;
  type: string;
  published: boolean;
  show_in_gallery: boolean;
  featured: boolean;
  homepage_order: number | null;
  created_at: string;
  thumbnailUrl: string | null;
  thumbnailAlt: string;
};

export async function getAdminPortfolioItems(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      "id,title,type,published,show_in_gallery,featured,homepage_order,created_at,portfolio_media(id,storage_bucket,storage_key,alt_text,is_primary)",
    )
    .eq("portfolio_media.is_primary", true)
    .order("created_at", { ascending: false });

  if (error) return { items: [] as AdminPortfolioItem[], error };

  const environment = getSupabaseEnvironment();
  const items = await Promise.all(
    (data ?? []).map(async (item) => {
      const media = item.portfolio_media?.[0];
      let thumbnailUrl: string | null = null;
      if (media?.storage_bucket === "portfolio-media") {
        thumbnailUrl = publicMediaUrl(
          environment.url,
          media.storage_bucket,
          media.storage_key,
        );
      } else if (media) {
        const { data: signed } = await supabase.storage
          .from(media.storage_bucket)
          .createSignedUrl(media.storage_key, 300);
        thumbnailUrl = signed?.signedUrl ?? null;
      }

      return {
        id: item.id,
        title: item.title,
        type: item.type,
        published: item.published,
        show_in_gallery: item.show_in_gallery,
        featured: item.featured,
        homepage_order: item.homepage_order,
        created_at: item.created_at,
        thumbnailUrl,
        thumbnailAlt: media?.alt_text ?? "",
      } satisfies AdminPortfolioItem;
    }),
  );

  return { items, error: null };
}

export async function getAdminHomepageDrawings(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("id,drawing_featured,homepage_drawing_order")
    .order("homepage_drawing_order", { ascending: true });
  return {
    placements: (data ?? []) as Array<{
      id: string;
      drawing_featured: boolean;
      homepage_drawing_order: number | null;
    }>,
    error,
  };
}
