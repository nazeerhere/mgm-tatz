import Image from "next/image";
import type { DevelopmentMedia } from "@/content/development-media";

export function DevelopmentGallery({
  items,
  headingLevel = "h3",
}: {
  items: readonly DevelopmentMedia[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="gallery editorial-gallery development-gallery">
      {items.map((item) => (
        <article className="work-card" key={item.src}>
          <div className="image-frame">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
              style={{
                objectFit: item.objectFit,
                objectPosition: item.objectPosition,
              }}
            />
          </div>
          <div className="work-meta">
            <p>{item.type} · development content</p>
            <Heading>{item.title}</Heading>
          </div>
        </article>
      ))}
    </div>
  );
}
