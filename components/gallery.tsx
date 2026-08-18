import {
  PortfolioGallery,
  type PortfolioGalleryItem,
} from "@/components/portfolio-gallery";
import { getSupabaseEnvironment } from "@/lib/env";
import type { GalleryFilters } from "@/lib/gallery-filters";
import { publicMediaUrl, type PublishedPortfolioItem } from "@/lib/portfolio";

export function Gallery({
  items,
  filters,
  totalCount,
  currentPage,
  totalPages,
  headingLevel = "h3",
}: {
  items: PublishedPortfolioItem[];
  filters: GalleryFilters;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  headingLevel?: "h2" | "h3";
}) {
  const { url } = getSupabaseEnvironment();
  const galleryItems = items.flatMap<PortfolioGalleryItem>((item) => {
    const media = item.portfolio_media[0];
    if (!media) return [];
    return [
      {
        id: item.id,
        src: publicMediaUrl(url, media.storage_bucket, media.storage_key),
        alt: media.alt_text,
        width: media.width ?? 1200,
        height: media.height ?? 1500,
        title: item.title,
        category: item.type.charAt(0).toUpperCase() + item.type.slice(1),
        description: item.description.trim() || undefined,
        type: item.type,
        styleSlugs: item.portfolio_item_style_tags.flatMap(({ style_tags }) => {
          if (Array.isArray(style_tags))
            return style_tags.map(({ slug }) => slug);
          return style_tags ? [style_tags.slug] : [];
        }),
        featured: item.featured,
        createdAt: item.created_at,
        displayOrder: item.display_order,
      },
    ];
  });

  return (
    <PortfolioGallery
      items={galleryItems}
      filters={filters}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      headingLevel={headingLevel}
    />
  );
}
