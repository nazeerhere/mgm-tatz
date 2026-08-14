"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type PortfolioGalleryItem = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  category: string;
  description?: string;
};

export function PortfolioGallery({
  items,
  headingLevel = "h2",
}: {
  items: readonly PortfolioGalleryItem[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeItem && !dialog.open) {
      dialog.showModal();
      document.body.classList.add("lightbox-open");
    } else if (!activeItem && dialog.open) {
      dialog.close();
    }

    return () => document.body.classList.remove("lightbox-open");
  }, [activeItem]);

  function closeLightbox() {
    dialogRef.current?.close();
  }

  return (
    <>
      <div className="portfolio-gallery" data-count={items.length}>
        {items.map((item, index) => (
          <article className="portfolio-tile" key={item.id}>
            <button
              className="portfolio-tile-open"
              type="button"
              aria-label={`View ${item.title}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="portfolio-tile-media">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 620px) calc(100vw - 2rem), (max-width: 960px) 50vw, 33vw"
                />
                <span className="portfolio-view-cue" aria-hidden="true">
                  View
                </span>
              </span>
            </button>
            <div className="portfolio-tile-meta">
              <p>{item.category}</p>
              <Heading>{item.title}</Heading>
              {item.description ? <p>{item.description}</p> : null}
            </div>
          </article>
        ))}
      </div>

      <dialog
        className="portfolio-lightbox"
        ref={dialogRef}
        aria-label={
          activeItem ? `${activeItem.title} detail view` : "Work detail"
        }
        onClose={() => {
          document.body.classList.remove("lightbox-open");
          setActiveIndex(null);
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
      >
        {activeItem ? (
          <div className="portfolio-lightbox-panel">
            <div className="portfolio-lightbox-media">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                sizes="(max-width: 720px) 92vw, 72vw"
              />
            </div>
            <div className="portfolio-lightbox-meta">
              <button
                className="portfolio-lightbox-close"
                type="button"
                onClick={closeLightbox}
              >
                <span aria-hidden="true">←</span> Back to gallery
              </button>
              <div>
                <p>{activeItem.category}</p>
                <h2>{activeItem.title}</h2>
                {activeItem.description ? (
                  <p>{activeItem.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
