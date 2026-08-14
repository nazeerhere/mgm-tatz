import {
  PortfolioGallery,
  type PortfolioGalleryItem,
} from "@/components/portfolio-gallery";
import type { DevelopmentMedia } from "@/content/development-media";

export function DevelopmentGallery({
  items,
  headingLevel = "h3",
}: {
  items: readonly DevelopmentMedia[];
  headingLevel?: "h2" | "h3";
}) {
  const galleryItems: PortfolioGalleryItem[] = items.map((item) => ({
    id: item.src,
    src: item.src,
    alt: item.alt,
    width: item.width,
    height: item.height,
    title: item.title,
    category: item.type,
  }));

  return <PortfolioGallery items={galleryItems} headingLevel={headingLevel} />;
}
