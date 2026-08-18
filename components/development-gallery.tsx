import {
  PortfolioGallery,
  type PortfolioGalleryItem,
} from "@/components/portfolio-gallery";
import type { DevelopmentMedia } from "@/content/development-media";
import type { GalleryFilters } from "@/lib/gallery-filters";

export function DevelopmentGallery({
  items,
  filters,
  totalCount,
  currentPage,
  totalPages,
  headingLevel = "h3",
}: {
  items: readonly DevelopmentMedia[];
  filters: GalleryFilters;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  headingLevel?: "h2" | "h3";
}) {
  const galleryItems: PortfolioGalleryItem[] = items.map((item, index) => ({
    id: item.src,
    src: item.src,
    alt: item.alt,
    width: item.width,
    height: item.height,
    title: item.title,
    category: item.type === "tattoo" ? "Tattoo" : "Drawing",
    type: item.type,
    styleSlugs: item.styleSlugs,
    featured: item.featured ?? false,
    displayOrder: index,
  }));

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
