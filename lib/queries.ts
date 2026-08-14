import { hasSupabaseEnvironment } from "@/lib/env";
import type { PublishedPortfolioItem } from "@/lib/portfolio";
import { createClient } from "@/lib/supabase/server";

export async function getPublishedPortfolioItems() {
  if (!hasSupabaseEnvironment())
    return { items: [] as PublishedPortfolioItem[], configured: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      "id,title,type,description,body_placement,featured,available,display_order,portfolio_media!inner(storage_bucket,storage_key,alt_text,width,height)",
    )
    .eq("published", true)
    .eq("portfolio_media.is_primary", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error("Published work is temporarily unavailable.");
  return { items: (data ?? []) as PublishedPortfolioItem[], configured: true };
}
