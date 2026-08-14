import {
  PortfolioGallery,
  type PortfolioGalleryItem,
} from "@/components/portfolio-gallery";
import { getSupabaseEnvironment } from "@/lib/env";
import { publicMediaUrl, type PublishedPortfolioItem } from "@/lib/portfolio";

export function Gallery({
  items,
  headingLevel = "h3",
}: {
  items: PublishedPortfolioItem[];
  headingLevel?: "h2" | "h3";
}) {
  if (!items.length)
    return (
      <p className="empty-state">
        Published work will appear here after portfolio images are approved.
      </p>
    );
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
        category: item.type,
        description: item.description.trim() || undefined,
      },
    ];
  });

  return <PortfolioGallery items={galleryItems} headingLevel={headingLevel} />;
}
