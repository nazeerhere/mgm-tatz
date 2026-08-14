import Image from "next/image";
import { getSupabaseEnvironment } from "@/lib/env";
import { publicMediaUrl, type PublishedPortfolioItem } from "@/lib/portfolio";

export function Gallery({
  items,
  headingLevel = "h3",
}: {
  items: PublishedPortfolioItem[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  if (!items.length)
    return (
      <p className="empty-state">
        Published work will appear here after portfolio images are approved.
      </p>
    );
  const { url } = getSupabaseEnvironment();
  return (
    <div className="gallery editorial-gallery">
      {items.map((item) => {
        const media = item.portfolio_media[0];
        if (!media) return null;
        return (
          <article className="work-card" key={item.id}>
            <div className="image-frame">
              <Image
                src={publicMediaUrl(
                  url,
                  media.storage_bucket,
                  media.storage_key,
                )}
                alt={media.alt_text}
                width={media.width ?? 1200}
                height={media.height ?? 1500}
                sizes="(max-width: 720px) 100vw, 50vw"
              />
            </div>
            <div className="work-meta">
              <p>
                {item.type}
                {item.body_placement ? ` · ${item.body_placement}` : ""}
              </p>
              <Heading>{item.title}</Heading>
              <p>{item.description}</p>
              {item.available ? <span>Available concept</span> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
